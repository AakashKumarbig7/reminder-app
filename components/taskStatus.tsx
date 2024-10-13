export default function TaskStatus() {
  return (

    <div className=" w-full  flex space-x-2">
      <div className="rounded-xl bg-white shadow w-2/6">
        <div className="flex flex-col items-center h-[110.33px] w-[88px]  rounded-[14px] justify-evenly">
          <span className="text-sm text-[12px] font-[600] text-[#000000]">
            Task <br></br>Created
          </span>
          <span className="text-[#14B8A6] text-xl font-bold">6893</span>
        </div>
      </div>

      <div className="flex flex-col justify-evenly rounded-[14px] bg-white items-center w-2/6 ">
        <span className="text-sm text-[12px] font-[600] text-[#000000]">
          Task<br></br> Completed
        </span>
        <span className="text-[#9ACC67] text-xl font-bold">6893</span>
      </div>

      <div className="flex flex-col justify-evenly rounded-[14px] bg-white items-center w-2/6">
        <span className=" text-sm text-[12px] font-[600] text-[#000000]">
          Task <br></br>Overdue
        </span>
        <span className="text-[#EE5A5A] text-xl font-bold">6893</span>
      </div>
    </div>

  );
}
