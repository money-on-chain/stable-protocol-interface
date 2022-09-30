import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import MocAmount from './default';
import { config } from './../../../Config/config';


const ThemeMoC = React.lazy(() => import('./themes/moc'));
const ThemeRDoC = React.lazy(() => import('./themes/rdoc'));


const ThemeSelector = ({ children }) => {
  const CHOSEN_THEME = config.environment.AppProject;//process.env.REACT_APP_ENVIRONMENT_APP_PROJECT;
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
    return (<ThemeSelector><MocAmount { ...params } /></ThemeSelector>)
}

export default ThemeRender;