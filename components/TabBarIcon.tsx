import React from 'react';
import { AntDesign } from '@expo/vector-icons';

interface TabBarIconProps {
  name: React.ComponentProps<typeof AntDesign>['name']; // Автоматически подгружает доступные имена иконок
  color: string;
}

export default function TabBarIcon({ name, color }: TabBarIconProps) {
  return <AntDesign name={name} size={26} color={color} />;
}
