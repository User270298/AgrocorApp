import React from 'react';
import { Tabs } from 'expo-router';
import TabBarIcon from '@/components/TabBarIcon';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Vessel"
        options={{
          title: 'Vessel Catcher',
          tabBarIcon: ({ color }) => <TabBarIcon name="earth" color={color} />,
        }}
      />
       <Tabs.Screen
        name="assistant"
        options={{
          title: 'Ассистент',
          tabBarIcon: ({ color }) => <TabBarIcon name="message1" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Offers"
        options={{
          title: 'Предложения',
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Requests"
        options={{
          title: 'Запросы',
          tabBarIcon: ({ color }) => <TabBarIcon name="tags" color={color} />,
        }}
      />
    </Tabs>
  );
}
