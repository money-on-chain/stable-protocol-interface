import React, { useEffect } from 'react';
//import ReactDOM from 'react-dom';
import MintCard from './default';
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

const ThemeRender = (params) => {
    return (<ThemeSelector><MintCard { ...params } /></ThemeSelector>)
}

export default ThemeRender;