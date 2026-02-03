import { Pressable, PressableProps } from 'react-native';

type ButtonProps = PressableProps & {
  type?: 'primary' | 'secondary' | 'outline' | 'text';
};

const styles = {
  primary: '',
  secondary: '',
  outline: '',
  text: '',
};

const Button: React.FC<ButtonProps> = (props) => {
  return <Pressable />;
};

export default Button;
