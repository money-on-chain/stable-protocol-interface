import { useTranslation } from "react-i18next";
import { config } from "../projects/config";

export const useProjectTranslation = () => {

    const ns = config.environment.AppProject.toLowerCase();
    const [t, i18n]= useTranslation(["global", ns]);

    return [t, i18n, ns]

};