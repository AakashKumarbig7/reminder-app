



export default function OverDue () {
  return (
    <>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-black">Overdue Task</h4>
        <p className="text-[#14B8A6] cursor-pointer">View all</p>
      </div>
      <div className="space-y-3 flex ">
        <div className="bg-white shadow-md pl-[12px] p-4  rounded-lg w-[217px] h-[157px] mr-2">
          <p className="bg-[#f4f4f8] text-[#737373] text-[12px] font-semibold  border-gray-300 inline-block px-[8px] rounded-[30px] py-[4px]">
            Design Team
          </p>
          <div className="w-[189px]  py-[12px] h-[48px]">
            <p className="text-[#000000]  text-base ">
              @Pugazh need to talk reg reminder app ui...
            </p>
          </div>
          <div className="flex  py-[16px] text-center
            justify-between">
            <p className="text-red-500  w-12 text-xs ">Yesterday</p>
            <p className="border bg-[#F8DADA] rounded-xl py-1 px-2 text-xs text-[#EE5A5A]  ">
              Todo
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md pl-[12px] p-4 space-x-2 rounded-lg w-[217px] h-[157px] mr-2">

        </div>
      </div>
    </>
  );
}
