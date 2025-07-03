import Link from "next/link";

const Navigation = () => {
  return (
    <div className="absolute bottom-0 w-screen">
      <div className="text-4xl">x</div>
      <div className="text-xl">
        <ul className="flex gap-4">
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
          <li>
            <Link href={"/"}>홈</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Navigation;
