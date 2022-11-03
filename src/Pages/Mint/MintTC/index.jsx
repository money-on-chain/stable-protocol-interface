import React, { useEffect } from 'react';
import Mint from './default';
import { config } from './../../../Config/config';


const ThemeMoC = React.lazy(() => import('./themes/moc'));
const ThemeRDoC = React.lazy(() => import('./themes/rdoc'));


const ThemeSelector = ({ children }) => {
  const CHOSEN_THEME = config.environment.AppProject;
  return (
    <>
      <React.Suspense fallback={<></>}>
        {(CHOSEN_THEME === 'MoC') && <ThemeMoC />}
        {(CHOSEN_THEME === 'RDoC') && <ThemeRDoC />}
      </React.Suspense>
      {children}
    </>
  )
}

const ThemeRender = () => {
    return (<ThemeSelector><Mint /></ThemeSelector>)
}

export default ThemeRender;