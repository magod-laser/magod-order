/** @format */

import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import WithNav from "./Layout/WithNav";
import Parentroute from "./Layout/Parentroute";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import HomeOne from "./pages/HomeOne";
import UserRolesModules from "./pages/admin/userrolesmodules";
import CreateUsers from "./pages/admin/createusers";
import MenuRoleMapping from "./pages/admin/menurolemapping";
import SendMail from "./pages/sendmail/sendmails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { RequireAuth } from "./pages/Auth/RequireAuth";
import Order from "../src/Customer/Order";
// Profile
import ProfileNewOrder from "./pages/Sales/Orders/Menus/Profile/NewOrder/ProfileNewOrder";
import FindOrder from "./pages/Sales/Orders/Menus/Profile/Find Order/FindOrder";
import ImportExcelForm from "./pages/Sales/Orders/Menus/Profile/Find Order/Body Tabs/OrderDetailsTab/ButtonTabs/ImportExcelForm";
import ImportQtn from "./pages/Sales/Orders/Menus/Profile/Find Order/Body Tabs/OrderDetailsTab/ButtonTabs/ImportQtn";
// import ScheduleCreationForm from "./pages/Sales/Orders/ZComponents/ScheduleCreationForm";
import NewOrderSerial from "./pages/Sales/Orders/Menus/Profile/Find Order/Body Tabs/OrderDetailsTab/NewOrderSerial";
import FindScheduleForm from "./pages/Sales/Orders/Menus/Profile/FindSchedule/FindScheduleForm";
import FindSchedule from "./pages/Sales/Orders/Menus/Profile/FindSchedule/FindSchedule";

import ProfileCreated from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileCreated";
import ProfileRecorded from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileRecorded";
import ProfileProcessing from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileProcessing";
import ProfileCompleted from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileCompleted";
import ProfileProduced from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileProduced";
import ProfilePacked from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfilePacked";
import ProfileDispatched from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileDispatched";
import ProfileAll from "./pages/Sales/Orders/Menus/Profile/OrderList/ProfileAll";

import ProfamaInvoiceForm from "./pages/Sales/Orders/Menus/Profile/Find Order/Body Tabs/ProfarmaInvoiceListTab/ProfamaInvoiceForm";
import ProfarmaInvoiceForm from "./pages/Sales/Orders/Components/ProfarmaInvoiceForm/ProfarmaInvoiceForm";
import NCProgram from "./pages/Sales/Orders/Menus/Profile/FindSchedule/NCProgram";
import EditDXF from "./pages/Sales/Orders/Menus/Profile/Find Order/Body Tabs/OrderDetailsTab/ButtonTabs/EditDXF";
import FixturesReady from "./pages/Sales/Orders/Menus/Profile/FixturesOrderList/FixturesReady";
import FixturesHandedOver from "./pages/Sales/Orders/Menus/Profile/FixturesOrderList/FixturesHandedOver";
import FixturesRecorded from "./pages/Sales/Orders/Menus/Profile/FixturesOrderList/FixturesRecorded";
import FixturesProcessing from "./pages/Sales/Orders/Menus/Profile/FixturesOrderList/FixturesProcessing";
import FixturesCompleted from "./pages/Sales/Orders/Menus/Profile/FixturesOrderList/FixturesCompleted";
import InternalRecorded from "./pages/Sales/Orders/Menus/Profile/InternalOrderList/InternalRecorded";
import InternalProcessing from "./pages/Sales/Orders/Menus/Profile/InternalOrderList/InternalProcessing";
import InternalCompleted from "./pages/Sales/Orders/Menus/Profile/InternalOrderList/IntCompleted";
import InternalReady from "./pages/Sales/Orders/Menus/Profile/InternalOrderList/InternalReady";
import InternalHandedOver from "./pages/Sales/Orders/Menus/Profile/InternalOrderList/InternalHandedOver";

// Combined Schedule
// import Create from "./pages/Sales/Orders/Menus/Combined Schedules/Job Work/Create/Create";
import CreateJW from "./pages/Combined Schedules_JobWork/Job Work/Create/CreateJW";
import CombinedScheduleList from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/Order/CombinedScheduleListJW";
import CombinedScheduleDetailsForm from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/Order/CombinedScheduleDetailsForm";
import Open from "./pages/Combined Schedules_JobWork/Job Work/Open/Open";

// Service
import ServiceNewOrder from "./pages/Sales/Orders/Menus/Service/NewOrder/ServiceNewOrder";
import ServiceFindOrder from "./pages/Sales/Orders/Menus/Service/FindOrder/ServiceFindOrder";

import ServiceAll from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceAll";
import ServiceCompleted from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceCompleted";
import ServiceCreated from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceCreated";
import ServiceDispatched from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceDispatched";
import ServicePacked from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServicePacked";
import ServiceProcessing from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceProcessing";
import ServiceProduced from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceProduced";
import ServiceRecorded from "./pages/Sales/Orders/Menus/Service/OrderList/Menus/ServiceRecorded";

import ServiceScheduleCreationForm from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/ServiceScheduleCreationForm";
import ServiceNewOrderSerial from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/DrawingOrderDetailsTabs/ServiceNewOrderSerial";
import ServiceNCProgram from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/ServiceNCProgram";
import ServiceOrderSchedule from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/ServiceOpenSchedule";
import ServiceImportQtn from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/Buttons/ServiceImportQtn";
import ServiceEditDxf from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/Buttons/ServiceEditDxf";

// Fabrication
import FabNewOrder from "./pages/Sales/Orders/Menus/Fabrication/NewOrder/FabNewOrder";
import FabFindOrder from "./pages/Sales/Orders/Menus/Fabrication/FindOrder/FabFindOrder";
import FabCreated from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabCreated";
import FabProcessing from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabProcessing";
import FabCompleted from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabCompleted";
import FabProduced from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabProduced";
import FabPacked from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabPacked";
import FabDispatched from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabDispatched";
import FabAll from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabAll";
import FabRecorded from "./pages/Sales/Orders/Menus/Fabrication/OrderList/FabRecorded";
import FabScheduleCreationForm from "./pages/Sales/Orders/Menus/Fabrication/ScheduleCreationForm/FabScheduleCreationForm";
import FabNewOrderSerial from "./pages/Sales/Orders/Menus/Fabrication/ScheduleCreationForm/BodyTabs/DrawingOrderDetailsTabs/FabNewOrderSerial";
import FabNCProgram from "./pages/Sales/Orders/Menus/Fabrication/ScheduleCreationForm/BodyTabs/ScheduleList/FabNCProgram";
import FabOrderSchedule from "./pages/Sales/Orders/Menus/Fabrication/ScheduleCreationForm/BodyTabs/ScheduleList/FabOpenSchedule";
import FabImportQtn from "./pages/Sales/Orders/Menus/Fabrication/ScheduleCreationForm/BodyTabs/Buttons/FabImportQtn";
import FabEditDxf from "./pages/Sales/Orders/Menus/Fabrication/ScheduleCreationForm/BodyTabs/Buttons/FabEditDxf";
import ProfileScheduleCreationForm from "./pages/Sales/Orders/Menus/Profile/ScheduleCreationForm/ProfileScheduleCreationForm";
import { QuotationProvider } from "./context/QuotationContext";
import { OrderProvider } from "./context/OrderContext";
import { MenuProvider } from "./context/MenusContext";
import ServiceOpenSchedule from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/ServiceOpenSchedule";
// import ProfarmaInvoiceForm from "./pages/Sales/Orders/Components/ProfarmaInvoiceForm/ProfarmaInvoiceForm";
import PackingNoteAndInvoiceDetails from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/Tabs/Details/PackingNoteAndInvoiceDetails";

import FindProOrder from "./pages/Sales/Orders/Menus/Profile/Find Order/FindOrder";

// prakruthis
import ScheduleList from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/ScheduleList";
import CombinedScheduleListClosed from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/Closed/CombinedScheduleListClosedJW";
import CombinedScheduleDetailsFormClosed from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/Closed/CombinedScheduleDetailsFormClosed";
import SalesCreate from "./pages/Combined Schedules_JobWork/Sales/Create Sales/SalesCreate";
import CombinedScheduleListJW from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/Order/CombinedScheduleListJW";
import CombinedScheduleListSales from "./pages/Combined Schedules_JobWork/Sales/ScheduleList/Order/CombinedScheduleListSales";
import CombinedScheduleListClosedJW from "./pages/Combined Schedules_JobWork/Job Work/ScheduleList/Closed/CombinedScheduleListClosedJW";
import CombinedScheduleListClosedSales from "./pages/Combined Schedules_JobWork/Sales/ScheduleList/Closed/CombinedScheduleListClosedSales";
import TaskSheet from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/TaskSheet";
import SolidStateLaserTable from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/SolidStateLaserTable";
import CoTable from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/CoTable";
import Solidstatelaser from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/JobParameters/SolidStateLaser/Solidstatelaser";
import Co2Form from "./pages/Sales/Orders/Menus/Service/ScheduleCreationForm/BodyTabs/ScheduleList/JobParameters/Co2Form/Co2Form";

function App() {
	return (
		<BrowserRouter>
			<MenuProvider>
				<QuotationProvider>
					{/* <OrderProvider> */}
					<ToastContainer position="top-center" />
					<Routes>
						<Route
							element={<Login />}
							path="/"
						/>
						{/* <Route element={<RequireAuth />}> */}
						<Route
							path="/home"
							element={<Home />}
						/>
						<Route
							path="/salesHome"
							element={<HomeOne />}
						/>
						{/* </Route> */}
						{/* <Route element={<RequireAuth />}> */}
						<Route element={<WithNav />}>
							<Route
								path="/Orders"
								element={<Parentroute />}>
								{/* Prakruthis */}
								<Route
									index
									element={<Order />}
								/>
								<Route
									path="/Orders/JobWork"
									element={<CreateJW />}
								/>
								<Route
									path="/Orders/JobWork/Create"
									element={<CreateJW />}
								/>
								<Route
									path="/Orders/JobWork/Open"
									element={<Open />}
								/>

								<Route
									path="/Orders/JobWork/ScheduleList"
									element={<ScheduleList />}
								/>

								<Route
									path="/Orders/JobWork/ScheduleList/Order"
									element={<CombinedScheduleListJW />}
								/>
								<Route
									path="/Orders/JobWork/ScheduleList/Order/OpenDetailForm"
									element={<CombinedScheduleDetailsForm />}
								/>
								<Route
									path="/Orders/JobWork/ScheduleList/Closed"
									element={<CombinedScheduleListClosedJW />}
								/>
								<Route
									path="/Orders/JobWork/ScheduleList/Closed/OpenDetailForm"
									element={<CombinedScheduleDetailsFormClosed />}
								/>

								{/* SALES */}
								<Route
									path="/Orders/Sales"
									element={<SalesCreate />}
								/>
								<Route
									path="/Orders/Sales/Create"
									element={<SalesCreate />}
								/>
								<Route
									path="/Orders/Sales/Open"
									element={<Open />}
								/>

								<Route
									path="/Orders/Sales/ScheduleList"
									element={<ScheduleList />}
								/>

								<Route
									path="/Orders/Sales/ScheduleList/Order"
									element={<CombinedScheduleListSales />}
								/>
								<Route
									path="/Orders/Sales/ScheduleList/Order/OpenDetailForm"
									element={<CombinedScheduleDetailsForm />}
								/>
								<Route
									path="/Orders/Sales/ScheduleList/Closed"
									element={<CombinedScheduleListClosedSales />}
								/>
								<Route
									path="/Orders/Sales/ScheduleList/Closed/OpenDetailForm"
									element={<CombinedScheduleDetailsFormClosed />}
								/>
								{/* Prakruthis */}

								<Route index={true} />

								<Route path="Profile">
									<Route index={true} />
									<Route
										path="NewOrder"
										element={<ProfileNewOrder />}
									/>
									<Route
										path="FindOrder"
										element={<FindProOrder />}
									/>
									<Route
										path="ScheduleCreationForm"
										element={<ProfileScheduleCreationForm />}
									/>

									<Route
										path="ProfileOpenSchedule"
										element={<ServiceOpenSchedule />}
									/>
									<Route
										path="FindOrder/ImportExcelForm"
										element={<ImportExcelForm />}
									/>
									<Route
										path="FindOrder/ImportQtn"
										element={<ImportQtn />}
									/>
									<Route
										path="FindOrder/EditDXF"
										element={<EditDXF />}
									/>
									<Route
										path="FindOrder/NewOrderSerial"
										element={<NewOrderSerial />}
									/>
									<Route
										path="FindOrder/ProfamaInvoiceForm"
										element={<ProfamaInvoiceForm />}
									/>

									<Route
										path="FindScheduleForm"
										element={<FindScheduleForm />}
									/>
									<Route
										path="FindSchedule"
										element={<FindSchedule />}
									/>
									<Route
										path="FindSchedule/NCProgram"
										element={<NCProgram />}
									/>

									<Route path="OrderList">
										<Route index={true} />
										<Route
											path="Created"
											element={<ProfileCreated />}
										/>
										<Route
											path="Recorded"
											element={<ProfileRecorded />}
										/>
										<Route
											path="Processing"
											element={<ProfileProcessing />}
										/>
										<Route
											path="Completed"
											element={<ProfileCompleted />}
										/>
										<Route
											path="Produced"
											element={<ProfileProduced />}
										/>
										<Route
											path="Packed"
											element={<ProfilePacked />}
										/>
										<Route
											path="Dispatched"
											element={<ProfileDispatched />}
										/>
										<Route
											path="All"
											element={<ProfileAll />}
										/>
									</Route>

									<Route path="FixturesOrderList">
										<Route index={true} />
										<Route
											path="Recorded"
											element={<FixturesRecorded />}
										/>
										<Route
											path="Processing"
											element={<FixturesProcessing />}
										/>
										<Route
											path="Completed"
											element={<FixturesCompleted />}
										/>
										<Route
											path="Ready"
											element={<FixturesReady />}
										/>
										<Route
											path="HandedOver"
											element={<FixturesHandedOver />}
										/>
									</Route>

									<Route path="InternalOrderList">
										<Route index={true} />
										<Route
											path="Recorded"
											element={<InternalRecorded />}
										/>
										<Route
											path="Processing"
											element={<InternalProcessing />}
										/>
										<Route
											path="Completed"
											element={<InternalCompleted />}
										/>
										<Route
											path="Ready"
											element={<InternalReady />}
										/>
										<Route
											path="HandedOver"
											element={<InternalHandedOver />}
										/>
									</Route>

									<Route
										path="ProformaInvoiceForm"
										element={<ProfarmaInvoiceForm />}
									/>
								</Route>

								<Route path="Service">
									<Route
										path="NewOrder"
										element={<ServiceNewOrder />}
									/>
									<Route
										path="ScheduleCreationForm"
										element={<ServiceScheduleCreationForm />}
									/>
									<Route
										path="FindOrder"
										element={<ServiceFindOrder />}
									/>
									<Route
										path="ProfamaInvoiceForm"
										element={<ProfamaInvoiceForm />}
									/>
									<Route
										path="ServiceOpenSchedule"
										element={<ServiceOpenSchedule />}
									/>
									<Route
										path="PackingNoteAndInvoiceDetails"
										element={<PackingNoteAndInvoiceDetails />}
									/>
									<Route path="OrderList">
										<Route
											path="All"
											element={<ServiceAll />}
										/>
										<Route
											path="Completed"
											element={<ServiceCompleted />}
										/>
										<Route
											path="Created"
											element={<ServiceCreated />}
										/>
										<Route
											path="Dispatched"
											element={<ServiceDispatched />}
										/>
										<Route
											path="Packed"
											element={<ServicePacked />}
										/>
										<Route
											path="Processing"
											element={<ServiceProcessing />}
										/>
										<Route
											path="Produced"
											element={<ServiceProduced />}
										/>
										<Route
											path="Recorded"
											element={<ServiceRecorded />}
										/>
									</Route>
									<Route
										path="NewOrderSerial"
										element={<ServiceNewOrderSerial />}
									/>

									<Route
										path="NCProgram"
										element={<ServiceNCProgram />}
									/>
									<Route
										path="TaskSheet"
										element={<TaskSheet />}
									/>
									<Route
										path="Solidstatelaser"
										element={<Solidstatelaser />}
									/>
									<Route
										path="Co2Form"
										element={<Co2Form />}
									/>

									<Route
										path="OrderSchedule"
										element={<ServiceOrderSchedule />}
									/>
									<Route
										path="ImportQtn"
										element={<ServiceImportQtn />}
									/>
									<Route
										path="EditDxf"
										element={<ServiceEditDxf />}
									/>
									<Route
										path="ProformaInvoiceForm"
										element={<ProfarmaInvoiceForm />}
									/>
								</Route>

								<Route path="Fabrication">
									<Route
										path="NewOrder"
										element={<FabNewOrder />}
									/>
									<Route
										path="ScheduleCreationForm"
										element={<FabScheduleCreationForm />}
									/>

									<Route
										path="FindOrder"
										element={<FabFindOrder />}
									/>

									<Route
										path="OrderList/Created"
										element={<FabCreated />}
									/>
									<Route
										path="OrderList/Processing"
										element={<FabProcessing />}
									/>

									<Route
										path="FabricationOpenSchedule"
										element={<ServiceOpenSchedule />}
									/>
									<Route
										path="OrderList/Completed"
										element={<FabCompleted />}
									/>
									<Route
										path="OrderList/Produced"
										element={<FabProduced />}
									/>
									<Route
										path="OrderList/Packed"
										element={<FabPacked />}
									/>
									<Route
										path="OrderList/Dispatched"
										element={<FabDispatched />}
									/>
									<Route
										path="OrderList/All"
										element={<FabAll />}
									/>
									<Route
										path="OrderList/Recorded"
										element={<FabRecorded />}
									/>
									<Route
										path="NewOrderSerial"
										element={<FabNewOrderSerial />}
									/>
									<Route
										path="NCProgram"
										element={<FabNCProgram />}
									/>
									<Route
										path="OrderSchedule"
										element={<FabOrderSchedule />}
									/>
									<Route
										path="ImportQtn"
										element={<FabImportQtn />}
									/>
									<Route
										path="EditDxf"
										element={<FabEditDxf />}
									/>

									<Route
										path="ProformaInvoiceForm"
										element={<ProfarmaInvoiceForm />}
									/>
								</Route>
							</Route>
						</Route>
						{/* </Route> */}
						{/* Catch-all route for any other paths */}
						{/* <Route
							path="*"
							element={
								<Navigate
									to="/"
									replace
								/>
							}
						/> */}
					</Routes>
					{/* </OrderProvider> */}
				</QuotationProvider>
			</MenuProvider>
		</BrowserRouter>
	);
}

export default App;
