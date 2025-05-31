// src/data/organsMetadata.js

import AG from "../assets/logos/blank_logos/AG_blank.png";
import STI from "../assets/logos/blank_logos/STI_blank.png";
import ECOSOC from "../assets/logos/blank_logos/ECOSOC_blank.png";
import CDH from "../assets/logos/blank_logos/CDH_blank.png";
import ONUM from "../assets/logos/blank_logos/ONUM_blank.png";
import PNUMA from "../assets/logos/blank_logos/PNUMA_blank.png";
import UNESCO from "../assets/logos/blank_logos/UNESCO_blank.png";
import ACNUR from "../assets/logos/blank_logos/ACNUR_blank.png";
import UNICEF from "../assets/logos/blank_logos/UNICEF_blank.png";
import OMS from "../assets/logos/blank_logos/OMS_blank.png";
import CAJ from "../assets/logos/blank_logos/CAJ_blank.png";
import OIT from "../assets/logos/blank_logos/OIT_blank.png";
import ONUDD from "../assets/logos/blank_logos/UNODC_blank.png";
import CED from "../assets/logos/blank_logos/CED_blank.png";
import CS from "../assets/logos/blank_logos/CS_blank.png";

const organsMetadata = [
  {
    id: "AG",
    nombre: "Asamblea General",
    color: "#E53935",
    icon: AG,
    driveLink: "#",
    topicLink: "https://drive.google.com/uc?export=download&id=1-TPkPqVtU02q55_EU0dA6TyJgUrAKo8w"
  },

  {
    id: "STI",
    nombre: "Sala de Tratados Internacionales",
    color: "#29B6F6",
    icon: STI,
    driveLink: "#",
    topicLink: "https://drive.google.com/uc?export=download&id=1JTQN0eWMayIIB58mG4FTviC2buM-fmr1"
  },
  {

    id: "CS",
    nombre: "Consejo de Seguridad",
    color: "#F06292",
    icon: CS,
    driveLink: "#",
    topicLink: "https://drive.google.com/uc?export=download&id=151xgmYVQVZiMC3oUhZG8EaPGMWkzLJzY"
  },

  // Los demás órganos no tienen topicLink y no serán renderizados en el SlideOver de tópicos ampliados
  {
    id: "ECOSOC", nombre: "Consejo Económico y Social", color: "#66BB6A", icon: ECOSOC, driveLink: "#"
  },
  {
    id: "CDH", nombre: "Consejo de Derechos Humanos", color: "#FFA726", icon: CDH, driveLink: "#"
  },
  {
    id: "ONUM", nombre: "Oficina de ONU Mujeres", color: "#AB47BC", icon: ONUM, driveLink: "#"
  },
  {
    id: "PNUMA", nombre: "Programa para el Medio Ambiente", color: "#26C6DA", icon: PNUMA, driveLink: "#"
  },
  {
    id: "UNESCO", nombre: "UNESCO", color: "#8D6E63", icon: UNESCO, driveLink: "#"
  },
  {
    id: "ACNUR", nombre: "Alto Comisionado de la ONU para los Refugiados", color: "#3949AB", icon: ACNUR, driveLink: "#"
  },
  {
    id: "UNICEF", nombre: "Fondo de la ONU para la Infancia", color: "#EF5350", icon: UNICEF, driveLink: "#"
  },
  {
    id: "OMS", nombre: "Organización Mundial de la Salud", color: "#FFCA28", icon: OMS, driveLink: "#"
  },
  {
    id: "CAJ", nombre: "Comisión de Asuntos Jurídicos", color: "#BDBDBD", icon: CAJ, driveLink: "#"
  },
  {
    id: "OIT", nombre: "Organización Internacional del Trabajo", color: "#C2185B", icon: OIT, driveLink: "#"
  },
  {
    id: "ONUDD", nombre: "Oficina de la ONU contra la Droga y el Delito", color: "#00897B", icon: ONUDD, driveLink: "#"
  },
  {
    id: "CED", nombre: "Comité Especial de Descolonización", color: "#616161", icon: CED, driveLink: "#"
  }
];

export default organsMetadata;
