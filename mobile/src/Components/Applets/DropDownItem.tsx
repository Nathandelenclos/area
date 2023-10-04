import Animated, {
  AnimatedRef,
  measure,
  runOnUI,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ColorValue,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import AppContext from '@contexts/app.context';
import { Title } from '@components/Title';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AppletsCheckBox from '@components/Applets/AppletsCheckBox';

type DropDownAnimationsValues = {
  listRef: AnimatedRef<any>;
  setHeight: () => void;
  firstHeightAnimationStyle: ViewStyle;
  heightAnimationStyle: ViewStyle;
  angleAnimationStyle: ViewStyle;
};

export type DropDownItemProps = {
  title: string;
  description: string;
  backgroundColor: ColorValue;
  titleColor: ColorValue;
  active: boolean;
  toggleActive?: (title: string) => void;
};

function useDropDownAnimations(): DropDownAnimationsValues {
  const listRef: AnimatedRef<any> = useAnimatedRef();
  const heightValue: SharedValue<number> = useSharedValue(0);
  const firstHeightValue: SharedValue<number> = useSharedValue(0);
  const open: SharedValue<boolean> = useSharedValue(false);

  const firstHeightAnimationStyle: ViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      height: firstHeightValue.value,
    }),
  );

  const heightAnimationStyle: ViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      height: heightValue.value,
      overflow: 'hidden',
    }),
  );

  const angleAnimationStyle: ViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ rotate: withTiming(`${open.value ? 180 : 0}deg`) }],
    }),
  );

  function setHeight() {
    if (heightValue.value === 0) {
      runOnUI((): void => {
        'worklet';
        firstHeightValue.value = withTiming(
          20,
          { duration: 50 },
          (isFinished: boolean | undefined) => {
            if (isFinished) {
              heightValue.value = withTiming(measure(listRef)!.height);
            }
          },
        );
      })();
    } else {
      heightValue.value = withTiming(
        0,
        {},
        (isFinished: boolean | undefined): void => {
          if (isFinished) {
            firstHeightValue.value = withTiming(0, { duration: 50 });
          }
        },
      );
    }
    open.value = !open.value;
  }

  return {
    listRef,
    setHeight,
    firstHeightAnimationStyle,
    heightAnimationStyle,
    angleAnimationStyle,
  };
}

export default function DropDownItem({
  title,
  description,
  backgroundColor,
  titleColor,
  active,
  toggleActive,
}: DropDownItemProps): React.JSX.Element {
  const { color, translate } = AppContext();
  const {
    listRef,
    setHeight,
    firstHeightAnimationStyle,
    heightAnimationStyle,
    angleAnimationStyle,
  }: DropDownAnimationsValues = useDropDownAnimations();
  const checkBoxColor = titleColor as string | undefined;

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          backgroundColor,
          borderRadius: 20,
          padding: 10,
          paddingVertical: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
        }}
      >
        <Title
          title={title}
          style={{ alignSelf: 'flex-start', color: titleColor }}
        />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setHeight()}
          >
            <Animated.View style={angleAnimationStyle}>
              <FontAwesomeIcon
                icon={'angle-down'}
                style={{
                  color: checkBoxColor,
                }}
              />
            </Animated.View>
          </TouchableOpacity>
          <AppletsCheckBox
            value={active}
            color={titleColor}
            bgColor={backgroundColor}
            onPress={() => (toggleActive ? toggleActive(title) : null)}
          />
        </View>
      </View>
      <View>
        <Animated.View
          style={[
            firstHeightAnimationStyle,
            {
              position: 'absolute',
              width: '100%',
              top: -20,
              backgroundColor: color.dropDownColor,
            },
          ]}
        />
        <Animated.View style={[heightAnimationStyle]}>
          <Animated.View
            ref={listRef}
            style={{
              position: 'absolute',
              width: '100%',
              top: 0,
            }}
          >
            <View
              style={{
                backgroundColor: color.dropDownColor,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                padding: 10,
              }}
            >
              <Title
                title={translate('description')}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 17,
                  color: 'black',
                }}
              />
              <Text style={{ fontSize: 15, paddingTop: 10, color: 'gray' }}>
                {description}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}
