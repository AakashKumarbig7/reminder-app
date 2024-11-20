// import { useRouter } from 'next/navigation';
// import WebNavbar from "@/app/(web)/components/navbar";
// export default function EditSpace({ params }: { params: { spaceId: string } }){
// const router = useRouter();
// const { spaceId } = params;

//     return(

//        <>
//         <WebNavbar />
        
//         <div className="px-3 w-full h-[65px] flex bg-white rounded-[12px] border-none items-center max-w-full">
//           <div className="flex space-x-[10px]">
//             <p className="rounded-lg text-sm text-black border w-[134px] h-[41px] ">
//               Space Setting
//             </p>
//             <button className="rounded-lg text-sm border w-[134px] h-[41px] text-gray-400">
//               Members
//             </button>
//           </div>
//           </div>
        
//        </>
//     )
// }








import { useRouter } from 'next/navigation';

export default function EditSpace({ params }: { params: { spaceId: string } }) {
  const router = useRouter();
  const { spaceId } = params;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Edit Space</h1>
      <p className="mt-2">You are editing: <strong>{spaceId}</strong></p>

      {/* Add your form or editing logic here */}

      <button
        onClick={() => router.push('/space-settings')} // Navigate back to the space settings page
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
}
