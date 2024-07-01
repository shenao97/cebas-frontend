import { ToastContainer } from 'react-toastify';
import { Provider } from "react-redux"

import store from "./redux/store"

import ConfigApp from "./config/ConfigApp"

import ConfigForm from "./components/config/ConfigForm"
import FormIrrigation from "./components/irrigation/FormIrrigation"
import TableIrrigation from "./components/irrigation/TableIrrigation"

function App() {

  return (
    <Provider store={store}>
      <ConfigApp>
        <div className="navbar">
          <div className="container">
            <img src="https://agritechmurcia.com/wp-content/uploads/2017/01/images.jpg" alt="Logo" className="logo" />
          </div>
        </div>

        <ConfigForm />
        <FormIrrigation />
        <TableIrrigation />
      </ConfigApp>
      <ToastContainer />
    </Provider>
  )
}

export default App
