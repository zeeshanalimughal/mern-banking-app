import { createError } from "../error.js";
import Account from "../models/Account.js";
import History from "../models/History.js";


export const depositAmount = async (req, res) => {
    try {
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

export const withdrawAmount = async (req, res, next) => {
    try {
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
            from: fromUser._id,
            to: toUser._id,
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