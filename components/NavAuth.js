import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./NavAuth.module.scss";
let cx = classNames.bind(styles);
export default function Navbar({ className, logout }) {
  return (
    <nav className={cx(["navbar", className])}>
      <div className={cx(["div-one", className])}>
        <Link href="/members">
          <a>Members</a>
        </Link>
      </div>
      <div className={cx(["div-one", className])}>
        <Link href="/create-post">
          <a>Create Post</a>
        </Link>
      </div>
      <div className={cx(["div-one", className])}>
        <Link href="/profile">
          <a>Profile</a>
        </Link>
      </div>
      <button className={cx(["button", className])} onClick={() => logout()}>
        Log Out
      </button>
    </nav>
  );
}
