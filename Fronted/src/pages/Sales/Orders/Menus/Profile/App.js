import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WithNav from "./Layout/WithNav";
import Parentroute from "./Layout/Parentroute";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";

import { QuotationProvider } from "./context/QuotationContext";
import { OrderProvider } from "./context/OrderContext";
import NewOrder from "./pages/Sales Module/Orders/Profile/NewOrder";
//import Create from "./pages/Sales Module/Orders/Combined Schedules/Job Work/Create/Create";
//import OrderInfoTab from "./pages/Sales Module/Orders/Profile/Find Order/Header Tabs/OrderInfoTab";
//import ProductionScheduleCreationTab from "./pages/Sales Module/Orders/Profile/Find Order/Header Tabs/ProductionScheduleCreationTab";
//import FindOldPart from "./pages/Sales Module/Orders/Profile/Find Order/Header Tabs/FindOldPart";
//import FindOrderHeaderTabs from "./pages/Sales Module/Orders/Profile/Find Order/Header Tabs/FindOrderHeaderTabs";
import FindOrder from "./pages/Sales Module/Orders/Profile/Find Order/FindOrder";
import ImportExcelForm from "./pages/Sales Module/Orders/Profile/Find Order/Body Tabs/OrderDetailsTab/ButtonTabs/ImportExcelForm";
import ImportQtn from "./pages/Sales Module/Orders/Profile/Find Order/Body Tabs/OrderDetailsTab/ButtonTabs/ImportQtn";
import ScheduleCreationForm from "./pages/Sales Module/Orders/Profile/Find Order/ScheduleCreationForm";
import NewOrderSerial from "./pages/Sales Module/Orders/Profile/Find Order/Body Tabs/OrderDetailsTab/NewOrderSerial";
import FindScheduleForm from "./pages/Sales Module/Orders/Profile/FindSchedule/FindScheduleForm";
import FindSchedule from "./pages/Sales Module/Orders/Profile/FindSchedule/FindSchedule";
import Created from "./pages/Sales Module/Orders/Profile/OrderList/Created";
import Recorded from "./pages/Sales Module/Orders/Profile/OrderList/Recorded";
import Processing from "./pages/Sales Module/Orders/Profile/OrderList/Processing";
import Completed from "./pages/Sales Module/Orders/Profile/OrderList/Completed";
import Packed from "./pages/Sales Module/Orders/Profile/OrderList/Packed";
import Dispatched from "./pages/Sales Module/Orders/Profile/OrderList/Dispatched";
import All from "./pages/Sales Module/Orders/Profile/OrderList/All";
import Produced from "./pages/Sales Module/Orders/Profile/OrderList/Produced";
import ProfamaInvoiceForm from "./pages/Sales Module/Orders/Profile/Find Order/Body Tabs/ProfarmaInvoiceListTab/ProfamaInvoiceForm";
import NCProgram from "./pages/Sales Module/Orders/Profile/FindSchedule/NCProgram";
import EditDXF from "./pages/Sales Module/Orders/Profile/Find Order/Body Tabs/OrderDetailsTab/ButtonTabs/EditDXF";
import Ready from "./pages/Sales Module/Orders/Profile/FixturesOrderList/Ready";
import HandedOver from "./pages/Sales Module/Orders/Profile/FixturesOrderList/HandedOver";
import FixturesRecorded from "./pages/Sales Module/Orders/Profile/FixturesOrderList/FixturesRecorded";
import FixturesProcessing from "./pages/Sales Module/Orders/Profile/FixturesOrderList/FixturesProcessing";
import FixturesCompleted from "./pages/Sales Module/Orders/Profile/FixturesOrderList/FixturesCompleted";
import InternalRecorded from "./pages/Sales Module/Orders/Profile/InternalOrderList/InternalRecorded";
import InternalProcessing from "./pages/Sales Module/Orders/Profile/InternalOrderList/InternalProcessing";
import InternalCompleted from "./pages/Sales Module/Orders/Profile/InternalOrderList/InternalCompleted";
import InternalReady from "./pages/Sales Module/Orders/Profile/InternalOrderList/InternalReady";
import InternalHandedOver from "./pages/Sales Module/Orders/Profile/InternalOrderList/InternalHandedOver";

function App() {
  return (
    <BrowserRouter>
      <QuotationProvider>
        <OrderProvider>
          <Routes>
            <Route element={<Login />} path="/" />
            <Route path="/home" element={<Home />} />

            <Route element={<WithNav />}>
              <Route path="/Orders" element={<Parentroute />}>
                <Route path="/Orders/NewOrder" element={<NewOrder />} />

                <Route path="/Orders/FindOrder" element={<FindOrder />} />
                <Route
                  path="/Orders/FindOrder/ScheduleCreationForm"
                  element={<ScheduleCreationForm />}
                />
                <Route
                  path="/Orders/ImportExcelForm"
                  element={<ImportExcelForm />}
                />
                <Route path="/Orders/ImportQtn" element={<ImportQtn />} />
                <Route path="/Orders/EditDXF" element={<EditDXF />} />
                <Route
                  path="/Orders/NewOrderSerial"
                  element={<NewOrderSerial />}
                />

                <Route
                  path="/Orders/FindScheduleForm"
                  element={<FindScheduleForm />}
                />
                <Route path="/Orders/FindSchedule" element={<FindSchedule />} />
                <Route
                  path="/Orders/FindSchedule/NCProgram"
                  element={<NCProgram />}
                />

                <Route path="/Orders/OrderList/Created" element={<Created />} />
                <Route
                  path="/Orders/OrderList/Recorded"
                  element={<Recorded />}
                />
                <Route
                  path="/Orders/OrderList/Processing"
                  element={<Processing />}
                />
                <Route
                  path="/Orders/OrderList/Completed"
                  element={<Completed />}
                />
                <Route
                  path="/Orders/OrderList/Produced"
                  element={<Produced />}
                />
                <Route path="/Orders/OrderList/Packed" element={<Packed />} />
                <Route
                  path="/Orders/OrderList/Dispatched"
                  element={<Dispatched />}
                />
                <Route path="/Orders/OrderList/All" element={<All />} />

                <Route
                  path="/Orders/ProfamaInvoiceForm"
                  element={<ProfamaInvoiceForm />}
                />

                <Route
                  path="/Orders/OrderList/FixturesRecorded"
                  element={<FixturesRecorded />}
                />
                <Route
                  path="/Orders/OrderList/FixturesProcessing"
                  element={<FixturesProcessing />}
                />
                <Route
                  path="/Orders/OrderList/FixturesCompleted"
                  element={<FixturesCompleted />}
                />
                <Route path="/Orders/OrderList/Ready" element={<Ready />} />
                <Route
                  path="/Orders/OrderList/HandedOver"
                  element={<HandedOver />}
                />

                <Route
                  path="/Orders/OrderList/InternalRecorded"
                  element={<InternalRecorded />}
                />
                <Route
                  path="/Orders/OrderList/InternalProcessing"
                  element={<InternalProcessing />}
                />
                <Route
                  path="/Orders/OrderList/InternalCompleted"
                  element={<InternalCompleted />}
                />
                <Route
                  path="/Orders/OrderList/InternalReady"
                  element={<InternalReady />}
                />
                <Route
                  path="/Orders/OrderList/InternalHandedOver"
                  element={<InternalHandedOver />}
                />
              </Route>
            </Route>
          </Routes>
        </OrderProvider>
      </QuotationProvider>
    </BrowserRouter>
  );
}

export default App;
