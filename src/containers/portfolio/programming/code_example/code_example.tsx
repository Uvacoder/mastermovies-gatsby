import React, { createContext, useContext } from "react";
import styles from "./code_example.module.css";

export const CodeExample: React.FC = () => {
  return (
    <code className={styles.code}>
      <div className={styles.badge}>C++</div>
      <Line>
        <DarkBlue>
          #include {"<"}iostream{">"}
        </DarkBlue>
      </Line>
      <Line>
        <DarkBlue>
          #include {"<"}string{">"}
        </DarkBlue>
      </Line>
      <Line>
        <DarkBlue>using namespace</DarkBlue> <Grey>std;</Grey>
      </Line>
      <br />
      <Line>
        <Grey>int main() {"{"}</Grey>
      </Line>
      <Block>
        <Line>
          <Blue>cout</Blue> <Grey children="<<" /> <Green>"Hello world!"</Green> <Grey children="<<" />{" "}
          <Blue>endl</Blue>
          <Grey>;</Grey>
        </Line>
        <Line>
          <DarkBlue>return</DarkBlue> <Purple>0</Purple>
          <Grey>;</Grey>
        </Line>
      </Block>
      <Line>
        <Grey>{"}"}</Grey>
      </Line>
    </code>
  );
};

const Indent = createContext(0);

const Block: React.FC = ({ children }) => {
  const indent = useContext(Indent);
  return <Indent.Provider value={indent + 2} children={children} />;
};

const Line: React.FC = ({ children }) => {
  const indent = useContext(Indent);
  return (
    <pre className={styles.line}>
      {" ".repeat(indent)}
      {children}
    </pre>
  );
};

const Green: React.FC = ({ children }) => <span className={styles.green} children={children} />;
const Blue: React.FC = ({ children }) => <span className={styles.blue} children={children} />;
const DarkBlue: React.FC = ({ children }) => <span className={styles.darkBlue} children={children} />;
const Purple: React.FC = ({ children }) => <span className={styles.purple} children={children} />;
const Grey: React.FC = ({ children }) => <span className={styles.grey} children={children} />;
