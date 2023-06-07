import styles from "./PostList.module.scss";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

export default function PostList({ posts, className }) {
  return (
    <ul className={cx(["ul", className])}>
      {posts?.nodes.map((post) => (
        <li className={cx(["li", className])} key={post.id}>
          <h2>{post.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: post.excerpt }}></p>
        </li>
      ))}
    </ul>
  );
}
