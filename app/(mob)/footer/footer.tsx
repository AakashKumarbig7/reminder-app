"use client";

import { FiHome } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks } from "lucide-react";
import styles from "@/styles/footer.module.css"; // Import the CSS module

export default function Footer() {
  const pathname = usePathname(); // Get the current pathname

  // Dynamically assign active class based on current path
  const getLinkClasses = (path: string) =>
    pathname === path
      ? `${styles["footer-link"]} ${styles["footer-link-active"]}`
      : styles["footer-link"];

  return (
    <footer className={styles.footer}>
      {/* Home Link */}
      <Link href="/home" prefetch className={getLinkClasses("/home")}>
        <div className="flex flex-col items-center">
          <FiHome
            className={pathname === "/home" ? styles["footer-icon-active"] : ""}
            size={22}
          />
          <p className={styles["footer-link-text"]}>Home</p>
        </div>
      </Link>

      {/* Task Link */}
      <Link href="/task" prefetch className={getLinkClasses("/task")}>
        <div className="flex flex-col items-center">
          <ListChecks
            className={pathname === "/task" ? styles["footer-icon-active"] : ""}
            size={22}
          />
          <p className={styles["footer-link-text"]}>Task</p>
        </div>
      </Link>
    </footer>
  );
}
