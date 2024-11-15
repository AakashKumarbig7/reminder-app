"use client";
import { FiHome, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation
import { ListChecks, BellDot } from 'lucide-react';
import styles from '@/styles/footer.module.css'; // Import the CSS module
import { useRouter } from 'next/router';

export default function Footer() {
  const pathname = usePathname(); // Get the current pathname

  const getLinkClasses = (path: string) =>
    pathname === path ? `${styles['footer-link']} ${styles['footer-link-active']}` : styles['footer-link'];
   
  return (
    <footer className={styles.footer}>
      <Link href="/home" className={getLinkClasses("/home")}>
        <div className="flex flex-col items-center">
          <FiHome className={`${pathname}==="/home"&& footer-link-active `} size={"22px"} />
          <p className={styles['footer-link-text']}>Home</p>
        </div>
      </Link>

      <Link href="/task" className={getLinkClasses("/task")}>
        <div className="flex flex-col items-center">
          <ListChecks className={`${pathname}==="/task"&& footer-link-active `} size={"22px"} />
          <p className={styles['footer-link-text']}>Task</p>
        </div>
      </Link>

      {/* <Link href="/members" className={getLinkClasses("/members")}>
        <div className="flex flex-col items-center">
          <FiUsers className={`${pathname}==="/members"&& footer-link-active `}size={"22px"} />
          <p className={styles['footer-link-text']}>Members</p>
        </div>
      </Link>

      <Link href="/notifications" className={getLinkClasses("/notifications")} >
        <div className="flex flex-col items-center">
          <BellDot className={`${pathname}==="/notifications"&& footer-link-active `} size={"22px"}/>
          <p className={styles['footer-link-text']}>Notification</p>
        </div>
      </Link> */}
    </footer>
  );
}
