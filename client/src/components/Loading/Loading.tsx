import styles from './Loading.module.css';

interface LoadingProps {
  style?: any;
}

const Loading: React.FC<LoadingProps> = ({ style }) => (
  <div className={styles.loadingioSpinnerRolling} style={style}>
    <div className={styles.ldio}>
      <div />
    </div>
  </div>
);

export default Loading;
