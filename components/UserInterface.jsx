import React from 'react';
import DetailView from '@/components/user/DetailView';
import HomeNewsSlider from '@/components/user/HomeNewsSlider';
import CardGrid from '@/components/user/CardGrid';

const UserInterface = ({ logic, uiText }) => {
  const { activeSubItem, setActiveSubItem, menuData, newsData, t, lang } = logic;
  const isHe = lang === 'he';

  if (activeSubItem) {
    return (
      <DetailView
        activeSubItem={activeSubItem}
        setActiveSubItem={setActiveSubItem}
        menuData={menuData}
        t={t}
        isHe={isHe}
        uiText={uiText}
      />
    );
  }

  return (
    <div className="space-y-12" dir={isHe ? 'rtl' : 'ltr'}>
      <HomeNewsSlider
        newsData={newsData}
        setActiveSubItem={setActiveSubItem}
        t={t}
        isHe={isHe}
      />

      {/* Using the renamed CardGrid */}
      <CardGrid
        menuData={menuData}
        setActiveSubItem={setActiveSubItem}
        t={t}
        isHe={isHe}
      />
    </div>
  );
};

export default UserInterface;