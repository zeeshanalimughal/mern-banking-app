import { createError } from "../error.js";
import Account from "../models/Account.js";
import History from "../models/History.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const depositAmount = async (req, res, next) => {
    try {
        if (req.user.type === "employee") return res.status(400).json({ message: "You can't deposit money" })
        const { amount } = req.body;
        if (!amount || parseFloat(amount) <= 0) return res.status(400).json({ message: "Valid amount is required", status: false });

        await Account.findOneAndUpdate({ user: req.user.id, accountStatus: true }, { $inc: { accountBalance: parseFloat(amount) } });

        const history = new History({
            from: req.user.id,
            amount,
            type: "deposit"
        })
        await history.save();

        return res.status(200).json({ message: "Amount deposited successfully", status: true });
    } catch (err) {
        next(err);
    }
}

export const depositCheck = async (req, res, next) => {
    try {
        if (req.user.type === "user") return res.status(400).json({ message: "You can't deposit check amount", status: false });

        const { amount, accountNumber, checkNumber } =
            req.body;
        if (!accountNumber) return res.status(400).json({ message: "Account number is required", status: false })

        if (!checkNumber) return res.status(400).json({ message: "Check number is required", status: false });

        if (!amount || parseFloat(amount) <= 0) return res.status(400).json({ message: "Valid amount is required", status: false });

        const account = await Account.findOne({
            accountNumber,
            accountStatus: true
        });

        if (account.checkDeposits.filter(check => check.checkNumber === checkNumber && check.isDeposited === true).length) {
            return res.status(400).json({ message: "Account or check not found", status: false })
        }

        await Account.findOneAndUpdate({
            accountNumber,
            accountStatus: true,
            "checkDeposits.checkNumber": checkNumber
        },
            { $inc: { accountBalance: parseFloat(amount) }, "checkDeposits.$.isDeposited": true });

        const history = new History({
            from: account.user,
            by: req.user.id,
            amount,
            type: "byCheck"
        })
        await history.save();

        return res.status(200).json({ message: "Check deposited successfully", status: true });
    } catch (err) {
        next(err);
    }
}


export const depositAmountWithCheck = async (req, res, next) => {
    try {
        if (req.user.type === "employee") return res.status(400).json({ message: "You can't submit check", status: false });

        if (!req.body.checkNumber) return res.status(400).json({ message: "Check number is required", status: false });
        if (req.body.checkNumber.length < 12 || req.body.checkNumber.length > 12) return res.status(400).json({ message: "Check number must be of 12 words", status: false });

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No file were uploaded.');
        }
        // access uploaded file with req.files.[fieldname]
        const file = req.files.checkImage;

        // move the file to the desired location
        const fileName = new Date().getTime() + '_' + file.name.split(' ').join('');
        const filePath = path.join(__dirname, '../public/uploads', fileName)
        const checkAlreadyExists = await Account.findOne(
            {
                user: req.user.id,
                "checkDeposits.checkNumber": req.body.checkNumber
            });

        if (checkAlreadyExists) return res.status(400).json({ message: "Check is already submitted", status: false });

        file.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            await Account.findOneAndUpdate({
                user: req.user.id,
                "checkDeposits.checkNumber": { $ne: req.body.checkNumber }
            },
                {
                    $push: { checkDeposits: { checkImage: fileName, checkNumber: req.body.checkNumber } },
                });

            return res.status(200).json({ message: "Check submitted successfully", status: true });

        });
    } catch (err) {
        next(err);
    }
}

export const withdrawAmount = async (req, res, next) => {
    try {
        if (req.user.type === "employee") return res.status(400).json({ message: "You can't withdraw amount", status: false });
        const { amount } = req.body;
        if (!amount || parseFloat(amount) <= 0) return res.status(400).json({ message: "Valid amount is required", status: false });
        const enoughAmountToWithdraw = await Account.findOne({ user: req.user.id, accountBalance: { $gte: parseFloat(amount) }, accountStatus: true });
        if (!enoughAmountToWithdraw) return res.status(400).json({ message: "Not enough amount to withdraw", status: false });

        await Account.findOneAndUpdate({ user: req.user.id, accountStatus: true }, { $inc: { accountBalance: -parseFloat(amount) } });

        const history = new History({
            from: req.user.id,
            amount,
            type: "withdraw"
        })
        await history.save();

        return res.status(200).json({ message: "Amount withdraw successfully", status: true });
    } catch (err) {
        next(err);
    }
}


export const transferAmount = async (req, res, next) => {
    try {
        if (req.user.type === "employee") return res.status(400).json({ message: "You can't transfer check amount", status: false });

        let { amount, accountNumber } = req.body;

        if (!accountNumber) {
            return res.status(400).json({ message: "Account number is required", status: false });
        }

        if (!amount || parseFloat(amount) <= 0) return res.status(400).json({ message: "Valid amount is required", status: false });

        const toUser = await Account.findOne({ accountNumber, accountStatus: true });

        if (!toUser) {
            return res.status(400).json({ message: "Account not found", status: false });
        }


        const fromUser = await Account.findOne({ user: req.user.id, accountBalance: { $gte: parseFloat(amount) } });


        if (!fromUser) return res.status(400).json({ message: "Not enough amount to transfer", status: false });

        if (accountNumber === fromUser.accountNumber) return res.status(400).json({ message: "Can't transfer to own account", status: false });

        toUser.accountBalance += parseFloat(amount);
        fromUser.accountBalance -= parseFloat(amount);

        const history = new History({
            from: req.user.id,
            to: toUser.user,
            amount,
            type: "transfer"
        })

        await fromUser.save();
        await toUser.save();
        await history.save();


        return res.status(200).json({ message: "Amount transfered successfully", status: true });
    } catch (err) {
        next(err);
    }
}



export const getUserAccount = async (req, res, next) => {
    try {
        const account = await Account.findOne({ user: req.user.id });
        if (!account) return res.status(400).json({ message: "Account not found", status: false });
        return res.status(200).json({ account, status: true });
    } catch (err) {
        next(err);
    }
}


export const getUserAccountHistory = async (req, res, next) => {
    try {
        const history = await History.find({
            $or: [{ to: req.user.id }, { from: req.user.id }]
        })
            .populate("from", { name: 1,type:1 })
            .populate("to", { name: 1,type:1 })
            .populate("by", { name: 1,type:1 })
            .sort({ 'createdAt': -1 });

        if (!history) return res.status(400).json({ message: "history not found", status: false });

        const depositWithdrawHistory = history?.filter(data => data.type == "deposit" || data.type == "withdraw");
        const transferHistory = history?.filter(data => data.type == "transfer");
        const checkDepositHistory = history?.filter(data => data.type == "byCheck");

        return res.status(200).json({ depositWithdrawHistory, transferHistory, checkDepositHistory, status: true });
    } catch (err) {
        next(err);
    }
}
export const getCheks = async (req, res, next) => {
    try {

        const checks = await Account.find({
            accountStatus: true,
            checkDeposits: { $ne: [] },
            "checkDeposits.isDeposited": false
        }, { user: 1, accountNumber: 1, checkDeposits: 1 })
            .populate("user", { name: 1 });
        const checksArray = [];

        checks?.forEach(check => {
            const filteredCheckDeposits = check?.checkDeposits?.filter(deposit => deposit.isDeposited === false);
            check.checkDeposits = filteredCheckDeposits
            checksArray.push(check)
        })

        return res.status(200).json({ checks: checksArray, status: true });
    } catch (err) {
        next(err);
    }
}
export const getAccountByCheckId = async (req, res, next) => {
    try {
        const { checkId } = req.params;
        if (!checkId) return res.status(400).json({ message: "Check id not provided", status: false })

        const account = await Account.findOne({
            accountStatus: true,
            checkDeposits: { $ne: [] },
            "checkDeposits.$._id": checkId
        }, { user: 1, accountNumber: 1, checkDeposits: 1 })
            .populate("user", { name: 1 });

        return res.status(200).json({ account, status: true });
    } catch (err) {
        next(err);
    }
}