import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { store, persistor } from './Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'

ReactDOM.render(<Provider store={store}>
    <PersistGate persistor={persistor}>
        <AuthContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthContextProvider>
    </PersistGate>
</Provider>, document.getElementById('root'))
