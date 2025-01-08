"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Loading from "@/components/ui/loading";
import { getLoggedInUserData, signIn } from "./action";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Lottie from "lottie-react";
import LottielabLogin1 from "../../../public/images/login_animation.json";
import "./style.css";

interface SupabaseError {
  message: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password is not recognised. Please try again.",
  }),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const [signinLoading, setSigninLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [signedInUserId, setSignedInUserId] = useState<string | null>("");

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [folderError, setFolderError] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");

  const notify = (message: string, success: boolean) =>
    toast[success ? "success" : "error"](message, {
      style: {
        borderRadius: "10px",
        background: "#fff",
        color: "#000",
      },
      position: "top-right",
      duration: 2000,
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSigninLoading(true);
    try {
      const res = await signIn(values.email, values.password);
      setSigninLoading(false);
      if (res?.error) {
        notify(`Sign in failed: ${res.error}`, false);
      } else {
        const user = await getLoggedInUserData();
        if (user?.user_metadata.status !== "Active") {
          notify("Your account is not active", false);
          return;
        }
        notify("Sign in successful", true);

        // console.log(user?.id);
        // localStorage.setItem("userId", user?.id!);
        // localStorage.setItem("userEmail", user?.email!);
        // Check the screen width and redirect accordingly
        const screenWidth = window.innerWidth;

        if (screenWidth >= 992) {
          route.push("/dashboard"); // Large devices
        } else if (screenWidth <= 991) {
          route.push("/home"); // Medium devices
        }
      }
    } catch (error) {
      setSigninLoading(false);
      notify(`Sign in failed: ${error}`, false);
    }
  }

  const handleSendEmail = async () => {
    setEmailLoading(true);
    const newErrors = { name: !folderNameInput };
    setFolderError(newErrors.name);

    if (newErrors.name) {
      notify("Please enter a valid email address", false); // Display error message if input is invalid
      setEmailLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        folderNameInput,
        {
          redirectTo: `${window.location.origin}/forget-password`,
        }
      );

      if (error) {
        notify(`Error: ${error.message}`, false); // Display error message if Supabase call fails
      } else {
        notify("Password reset link sent to your email", true); // Success notification
      }

      setCreateFolderOpen(false);
      setFolderNameInput("");
    } catch (error) {
      const typedError = error as SupabaseError;
      notify(`Error: ${typedError.message}`, false);
    } finally {
      setEmailLoading(false);
    }
  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await getLoggedInUserData();
      if (user) {
        setSignedInUserId(user.id);
      }
    };
    fetchUserId();
  }, [signedInUserId]);

  //   if (isLoading) {
  //     return <Loading />;
  //   }

  return (
    <div className="md:flex sm:block justify-end min-h-screen font-inter">
      <p>sign in</p>
    </div>
  );
};

export default SignIn;
