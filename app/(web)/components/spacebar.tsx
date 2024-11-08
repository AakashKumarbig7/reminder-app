// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";
// import { useState } from "react";

// const WebSpacebar = () => {
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedService, setSelectedService] = useState("");
//   const [isEditor, setIsEditor] = useState(false);
//   const [editingServiceIndex, setEditingServiceIndex] = useState(-1);
//   const [inputValue, setInputValue] = useState("");
//   const [services, setServices] = useState<string[]>([]);

//   const handleServiceChange1 = (service: string, index: number) => {
//     setSelectedService(service);
//     setIsEditor(true);
//     setEditingServiceIndex(index);
//   };
//   const handleKeyDown = (value: string) => {
//     if (value === "") {
//       setSelectedService("");
//       setIsEditor(false);
//       setEditingServiceIndex(-1);
//     } else {
//       setInputValue(value);
//     }
//   };
// //   const services = ["To Do", "In Progress", "Internal Feedback", "Completed"];

//   const handleDeleteService = async (index: number) => {
//     // Store the original data in local storage before deletion
//     localStorage.removeItem("DeleteServiceData");

//     const servicesWithCityBeforeDelete = [...servicesWithCity];
//     const serviceDetailsBeforeDelete = { ...serviceDetails };
//     const cityTotalsBeforeDelete = { ...cityTotals };
//     const serviceTotalsBeforeDelete = { ...serviceTotals };
//     const servicesBeforeDelete = [...services];
//     const serviceToDelete = services[index];
//     const activeService =
//       typeof services[index - 1] === "undefined"
//         ? services.length > 1
//           ? services[index + 1]
//           : null
//         : services[index - 1];

//     localStorage.setItem(
//       "DeleteServiceData",
//       JSON.stringify({
//         servicesWithCityBeforeDelete,
//         serviceDetailsBeforeDelete,
//         cityTotalsBeforeDelete,
//         serviceTotalsBeforeDelete,
//         servicesBeforeDelete,
//         serviceToDelete,
//       })
//     );



//     // Update services with city after deletion
//     const servicesWithCityAfterDelete = servicesWithCity.map((cityDetail) => {
//       if (cityDetail.city === selectedCity) {
//         return {
//           ...cityDetail,
//           services: cityDetail.services.filter((service: string) => service !== serviceToDelete),
//         };
//       }
//       return cityDetail;
//     });

//     const updatedServices = services.filter((_, i) => i !== index);


//     // Define the structure of the service details per service
//     interface ServiceDetailItem {
//       due: number | string;
//       paid: number | string;
//       items: string | number;
//       profit: number | string;
//       quantity: number | string;
//       actualcost: number | string;
//       difference: number | string;
//       estimation: number | string;
//     }

//     interface ServiceDetails {
//       [serviceName: string]: ServiceDetailItem[];
//     }

//     // Update service details after deletion
//     const serviceDetailsAfterDelete: { [location: string]: ServiceDetails } = Object.keys(serviceDetails).reduce((acc, location) => {
//       if (location === selectedCity) {
//         acc[location] = Object.keys(serviceDetails[location]).reduce((innerAcc, service) => {
//           if (service !== serviceToDelete) {
//             innerAcc[service] = serviceDetails[location][service];
//           }
//           return innerAcc;
//         }, {} as ServiceDetails);
//       } else {
//         acc[location] = serviceDetails[location];
//       }
//       return acc;
//     }, {} as { [location: string]: ServiceDetails });

//     // Function to calculate total for service items of the service to delete
//     const calculateTotalForServiceToDelete = (serviceItems: ServiceDetailItem[] | null): ServiceDetailItem => {
//       // Safeguard against null serviceItems
//       if (!serviceItems) {
//         return {
//           due: 0,
//           paid: 0,
//           items: "",
//           profit: 0,
//           quantity: 0,
//           actualcost: 0,
//           difference: 0,
//           estimation: 0,
//         } as ServiceDetailItem;
//       }

//       return serviceItems.reduce((acc, item) => {
//         // Aggregate quantities and financial metrics
//         acc.quantity = (Number(acc.quantity) || 0) + (Number(item.quantity) || 0);
//         acc.actualcost = (Number(acc.actualcost) || 0) + (Number(item.actualcost) || 0);
//         acc.paid = (Number(acc.paid) || 0) + (Number(item.paid) || 0);
//         acc.estimation = (Number(acc.estimation) || 0) + (Number(item.estimation) || 0);

//         // Calculate derived fields
//         acc.due = acc.estimation - acc.paid;
//         acc.profit = (Number(acc.estimation) || 0) - (Number(acc.actualcost) || 0);
//         acc.difference = (Number(acc.estimation) || 0) - (Number(acc.actualcost) || 0);

//         return acc;
//       }, {
//         due: 0,
//         paid: 0,
//         items: "",
//         profit: 0,
//         quantity: 0,
//         actualcost: 0,
//         difference: 0,
//         estimation: 0,
//       } as ServiceDetailItem);
//     };

//     // Calculate totals for the service to delete
//     const serviceItemsToDelete = serviceDetails[selectedCity!]?.[serviceToDelete] || [];
//     const totalsForService: ServiceDetailItem = calculateTotalForServiceToDelete(serviceItemsToDelete);

//     const updateServiceTotalsAfterDelete = (
//       serviceTotals: { [city: string]: { [service: string]: number } },
//       selectedCity: string,
//       serviceToDelete: string
//     ) => {
//       const updatedServiceTotals = { ...serviceTotals };

//       // Check if the selected city exists in the serviceTotals
//       if (updatedServiceTotals[selectedCity]) {
//         // Remove the specified service from the selected city's totals
//         delete updatedServiceTotals[selectedCity][serviceToDelete];
//       }

//       return updatedServiceTotals; // Return the updated totals
//     };

//     const updateSelectedCityTotals = (
//       locationDetails: { [location: string]: { [key: string]: number } },
//       selectedCity: string,
//       totals: ServiceDetailItem
//     ): { [key: string]: { [key: string]: number } } => {
//       const cityDetails = locationDetails[selectedCity];

//       if (cityDetails) {
//         // Update city details by subtracting totalsForService
//         locationDetails[selectedCity] = {
//           due: cityDetails.due - Number(totals.due),
//           paid: cityDetails.paid - Number(totals.paid),
//           profit: cityDetails.profit - Number(totals.profit),
//           quantity: cityDetails.quantity - Number(totals.quantity),
//           actualcost: cityDetails.actualcost - Number(totals.actualcost),
//           difference: cityDetails.difference - Number(totals.difference),
//           estimation: cityDetails.estimation - Number(totals.estimation),
//         };
//       }

//       return locationDetails;
//     };

//     const updatedLocationDetails = updateSelectedCityTotals(cityTotals, selectedCity!, totalsForService);


//     try {
//       const { error } = await supabase
//         .from("events")
//         .update({
//           services: servicesWithCityAfterDelete,
//         })
//         .eq("id", params.id);

//       if (error) throw error;

//       const { error: error2 } = await supabase
//         .from("service_details")
//         .update({
//           details: serviceDetailsAfterDelete,
//           city_totals: updatedLocationDetails,
//           service_totals: updateServiceTotalsAfterDelete(serviceTotals, selectedCity!, serviceToDelete),
//         })
//         .eq("event_id", params.id);

//       if (error2) throw error2;

//     } catch (error) {
//       console.error("Error deleting service:", error);
//     }
//     setSelectedService(activeService);
//     setServices(updatedServices);
//     setServicesWithCity(servicesWithCityAfterDelete);
//     setServiceDetails(serviceDetailsAfterDelete);
//     setCityTotals(updatedLocationDetails);
//     setServiceTotals(updateServiceTotalsAfterDelete(serviceTotals, selectedCity!, serviceToDelete));
//     setServiceUndo(true);
//   };

//   const handleAddService = async () => {
//     let nextServiceNumber = services.length ? services.length + 1 : 1;
//     let newService = `Service ${nextServiceNumber}`;

//     // Ensure the service name is unique by incrementing the number if it already exists
//     while (services.includes(newService)) {
//       nextServiceNumber += 1;
//       newService = `Service ${nextServiceNumber}`;
//     }

//     const updatedServices = [...services, newService];
//     setServices(updatedServices); // Update local state
//     setSelectedService(newService); // Set the newly added service as active

//     // Parse the JSONB column for service details
//     const details = serviceDetails || {};

//     // Check if selectedCity exists in the details
//     if (!selectedCity) return;
//     if (!details[selectedCity]) {
//       details[selectedCity] = {};
//     }

//     // Add the new service to the city's details, with an empty array
//     details[selectedCity][newService] = [{
//       "due": 0,
//       "paid": "",
//       "items": "",
//       "profit": 0,
//       "quantity": "",
//       "actualcost": "",
//       "difference": 0,
//       "estimation": ""
//     }];

//     // Update the database with the new service details
//     const { error: updateError } = await supabase
//       .from("service_details")
//       .update({ details })
//       .eq("event_id", params.id);

//     if (updateError) {
//       console.error("Error updating service details:", updateError);
//     } else {
//       setServiceDetails((prevServiceDetails) => ({
//         ...prevServiceDetails,
//         [selectedCity]: {
//           ...prevServiceDetails[selectedCity],
//           [newService]: [{
//             "due": 0,
//             "paid": "",
//             "items": "",
//             "profit": 0,
//             "quantity": "",
//             "actualcost": "",
//             "difference": 0,
//             "estimation": ""
//           }],
//         },
//       }));
//     }

//     // Update services in the database
//     await updateServicesInDatabase(updatedServices);
//     setNewRowAdded(true); // Mark new row as added

//     setRowAdded(true); // Mark row as added
//   };

//   return (
//     <>
//       {selectedCity && (
//         <div className="mb-4 flex justify-between items-center text-center bg-[#E9ECF0] p-1 border-none rounded-[6px] overflow-x-auto max-w-full w-fit">
//           <div className="flex  space-x-2">
//             {services.map((service, index) => {
//               return (
//                 <div key={service} className="flex items-center space-x-2">
//                   <button
//                     onClick={() => {
//                       handleServiceChange1(service, index);
//                       if (editingServiceIndex !== index) {
//                         setInputValue(service);
//                       }
//                     }}
//                     className={`px-6 py-2 text-sm rounded flex items-center ${
//                       selectedService === service
//                         ? "bg-white text-primary-text_primary shadow-md text-sm font-semibold"
//                         : "bg-[#E9ECF0] font-semibold text-gray-500"
//                     }`}
//                   >
//                     {selectedService === service && isEditor ? (
//                       <input
//                         type="text"
//                         value={
//                           editingServiceIndex === index ? inputValue : service
//                         }
//                         onChange={(e) => setInputValue(e.target.value)}
//                         onBlur={(e) => handleKeyDown(e.target.value)}
//                         className="bg-transparent text-center focus-visible:border-none truncate px-2 min-w-[60px] max-w-[100px] text-sm "
//                         style={{
//                           width: `${
//                             editingServiceIndex === index
//                               ? inputValue.length
//                               : service.length + 1
//                           }ch`,
//                         }}
//                         placeholder="Edit service"
//                         aria-label="Service name"
//                       />
//                     ) : (
//                       <div
//                         className={` 
//         truncate max-w-[100px] px-2
//       text-sm`}
//                       >
//                         {service}
//                       </div>
//                     )}

//                     {selectedService === service && isEditor && (
//                       <AlertDialog>
//                         <AlertDialogTrigger>
//                           <button
//                             className=""
//                             aria-label="Delete Selected Items"
//                           >
//                             <Trash2 size={18} className="-mb-1" />
//                           </button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent className="bg-white border rounded-[10px]">
//                           <AlertDialogHeader>
//                             <AlertDialogTitle className="text-lg">
//                               Delete {selectedService}
//                             </AlertDialogTitle>
//                             <AlertDialogDescription>
//                               Are you sure you want to delete this service?
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel className="px-8 py-2 border border-[#D4D4D8] rounded hover:bg-blue-50 text-primary-text_primary">
//                               Cancel
//                             </AlertDialogCancel>
//                             <AlertDialogAction
//                               className="px-8 py-2 border border-[#1A80F4] bg-[#1A80F4] text-white rounded hover:bg-[#32A0FF]"
//                               onClick={() => handleDeleteService(index)}
//                             >
//                               Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     )}
//                   </button>
//                 </div>
//               );
//             })}

//             {isEditor && (
//               <Button
//                 type="button"
//                 onClick={handleAddService}
//                 className="py-0 px-4 border rounded-[4px] text-sm text-gray-500 whitespace-nowrap flex items-center gap-2 border-gray-100"
//               >
//                 <div className="w-5 h-5 flex  items-center justify-center bg-gray-100 text-[#A1A1AA] rounded-full border-[#A1A1AA] border-[1px]">
//                   <Plus size={14} />
//                 </div>
//                 Add Service
//               </Button>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default WebSpacebar;
