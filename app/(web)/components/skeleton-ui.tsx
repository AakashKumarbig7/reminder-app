import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    height?: string;
    width?: string;
}

const DefaultSkeleton = () => {
  return (
    <main className="grid grid-flow-row auto-rows-max gap-3">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((id) => (
        <div key={id} className="grid-flow-col auto-cols-max gap-12">
          <Skeleton className="bg-gray-300 p-3 h-10 w-full">
            <div className="flex items-center justify-end">
              <Skeleton className="h-6 w-2 rounded -mt-1" />
            </div>
          </Skeleton>
        </div>
      ))}
    </main>
  );
};

export default DefaultSkeleton;
// export { FolderSkeleton, ContentSkeleton, LayoutSkeleton, UploadProfileSkeleton };