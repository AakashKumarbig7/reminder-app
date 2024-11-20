"use client";
import { useState,useEffect,  } from "react";
import WebNavbar from "@/app/(web)/components/navbar";
import { ClipboardPlus, Trash, Pencil } from "lucide-react";
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SpaceSetting() {
  // State for storing spaces
  const [spaces, setSpaces] = useState<{ name: string }[]>([]);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility state
  const router = useRouter();

  const fetchSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from('spaces') // Your table name
        .select('space_name'); // Only fetch the column you need

      if (error) {
        console.error('Error fetching spaces:', error.message);
        return;
      }

      setSpaces(data.map((space) => ({ name: space.space_name }))); // Map the result to match the state structure
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  
  const addSpace = async () => {
    if (newSpaceName.trim() !== '') {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .insert([{ space_name: newSpaceName }]);

        if (error) {
          console.error('Error inserting space:', error.message);
          return;
        }

        setNewSpaceName(''); // Clear the input
        setIsDialogOpen(false); // Close the dialog
        fetchSpaces(); // Refresh the spaces after insertion
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }
  };

  // Fetch spaces on component mount
  useEffect(() => {
    fetchSpaces();
  }, []);
  // Delete space
  const deleteSpace = async (name: string) => {
    try {
      const { error } = await supabase
        .from('spaces') // Your table name
        .delete()
        .eq('space_name', name); // Match the space_name column to delete the correct row
  
      if (error) {
        console.error('Error deleting space:', error.message);
        return;
      }
  
      fetchSpaces(); // Refresh the spaces list after deletion
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  

  return (
    <>
      <WebNavbar />
      <div className="px-3">
        {/* Parent div setup as a flex container */}
        <div className="px-3 w-full h-[65px] flex bg-white rounded-[12px] border-none items-center max-w-full">
          <div className="flex space-x-[10px]">
            <button className="rounded-lg text-sm text-white border w-[134px] h-[41px] bg-primaryColor-700">
              Space Setting
            </button>
            <button className="rounded-lg text-sm border w-[134px] h-[41px] text-gray-400">
              Members
            </button>
          </div>

          {/* New Space button triggered by dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="rounded-lg text-sm text-white border flex items-center h-[41px] bg-primaryColor-700 space-x-2 ml-auto px-5 py-[2.5px]">
                <ClipboardPlus className="h-5 w-5" />
                <span className="leading-none">New Space</span>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[534px] font-inter">
              <DialogHeader className="text-gray-500 text-base font-semibold">
                <DialogTitle className="text-base">Space Setting</DialogTitle>
              </DialogHeader>

              <div>
                <Label htmlFor="name" className="text-sm text-[#111928] font-medium">
                  Space Name:
                </Label>
                <Input
                  id="name"
                  placeholder="Space Name"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="text-gray-500 mt-1.5 py-3 px-2 bg-gray-50 border border-gray-300 rounded-md focus-visible:ring-transparent"
                />
              </div>

              <DialogFooter className="flex justify-center items-center">
                <Button
                  type="button"
                  onClick={addSpace}
                  className="bg-primaryColor-700 hover:bg-blue-600 text-white"
                >
                  Create Space
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table displaying spaces */}
        <div className="pt-[18px]">
          <Table className="border-b border-gray-200  bg-white rounded-lg">
            <TableHeader className="">
              <TableRow className="w-[250px] h-[52px]">
                <TableHead className="px-4 py-4 text-sm">SPACE NAME</TableHead>
                <TableHead className="px-4 py-4 text-sm">CREATED BY</TableHead>
                <TableHead className="px-4 py-4 text-sm">TEAMS</TableHead>
                <TableHead className="px-4 py-4 text-sm">MEMBERS</TableHead>
                <TableHead className="px-4 py-4 text-sm">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.map((space, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-4 text-sm text-gray-900">{space.name}</TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-500">Laxman Sarav</TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap" >Management Team,DesignTeam,Development Team</TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-500">
                  </TableCell>
                  <TableCell className="px-4 py-4 items-center">
                    <button
                   onClick={() => router.push(`/editspace/${space.name}`)} >
                   
                      <Pencil className="h-5 w-5 "/>
                    </button>
                    <button
                      onClick={() => deleteSpace(space.name)}
                      className="py-4 px-4"
                    >
                      <Trash className="h-5 w-5 items-center" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
