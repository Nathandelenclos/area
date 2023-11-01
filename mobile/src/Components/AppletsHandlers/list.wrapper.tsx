import React from 'react';
import { SafeAreaView } from 'react-native';
import AppContext from '@contexts/app.context';
import Header from '@components/Header';

export default function ListWrapper({
  navigation,
  children,
  title_key,
}: {
  navigation: any;
  children: React.ReactNode;
  title_key: string;
}) {
  const { color, translate } = AppContext();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color.mode,
      }}
    >
      <Header
        title={translate(title_key)}
        leftIcon={'angle-left'}
        onPressLeft={() => navigation.pop()}
      />
      {children}
    </SafeAreaView>
  );
}
