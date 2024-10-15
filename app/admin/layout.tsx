
import ProtectedRoute from "@/components/auth/protectedRoute";
import Footer from "@/components/footer/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ProtectedRoute allowedRoles={['admin']}>
    <div>
      {children}
      <Footer />
    </div>
    // </ProtectedRoute>
  );
}
