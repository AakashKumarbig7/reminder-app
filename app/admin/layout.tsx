
import Footer from "@/app/(mob)/footer/footer";

export default function Layout({
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
    //  </ProtectedRoute>
  );
}
