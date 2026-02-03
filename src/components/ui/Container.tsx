import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = PropsWithChildren<{
  className?: string;
  safeArea?: boolean;
  safeAreaClass?: string;
  keyboardAvoiding?: boolean;
}>;

const Container: React.FC<ContainerProps> = (props) => {
  const safeArea = props.safeArea || props.safeArea === void 0;

  const className = clsx('flex-1', props.className);

  const view = props.keyboardAvoiding ? (
    <KeyboardAvoidingView behavior="padding" className={className}>
      {props.children}
    </KeyboardAvoidingView>
  ) : (
    <View className={className}>{props.children}</View>
  );

  const content = safeArea ? (
    <SafeAreaView className={clsx('flex-1 bg-background', props.safeAreaClass)}>
      {view}
    </SafeAreaView>
  ) : (
    view
  );

  return content;
};

export default Container;
