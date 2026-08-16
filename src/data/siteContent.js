import agLogo from "../assets/logos/ag.png";
import agBlankLogo from "../assets/logos/blank_logos/AG_blank.png";
import acnurLogo from "../assets/logos/acnur.png";
import cajLogo from "../assets/logos/caj.png";
import cdhLogo from "../assets/logos/cdh.png";
import csLogo from "../assets/logos/cs.png";
import ecosocLogo from "../assets/logos/ecosoc.png";
import oitLogo from "../assets/logos/oit.png";
import omsLogo from "../assets/logos/oms.png";
import onuddLogo from "../assets/logos/onudd.png";
import onumLogo from "../assets/logos/onum.png";
import pnumaLogo from "../assets/logos/pnuma.png";
import stiLogo from "../assets/logos/sti.png";
import unescoLogo from "../assets/logos/unesco.png";
import unicefLogo from "../assets/logos/unicef.png";
import unodaLogoCompleto from "../assets/logos/unodaCompleto.png";
import ACNURBlank from "../assets/logos/blank_logos/ACNUR_blank.png";
import CAJBlank from "../assets/logos/blank_logos/CAJ_blank.png";
import CDHBlank from "../assets/logos/blank_logos/CDH_blank.png";
import CSBlank from "../assets/logos/blank_logos/CS_blank.png";
import ECOSOCBlank from "../assets/logos/blank_logos/ECOSOC_blank.png";
import OITBlank from "../assets/logos/blank_logos/OIT_blank.png";
import OMSBlank from "../assets/logos/blank_logos/OMS_blank.png";
import ONUDDBlank from "../assets/logos/blank_logos/UNODC_blank.png";
import ONUMBlank from "../assets/logos/blank_logos/ONUM_blank.png";
import PNUMABlank from "../assets/logos/blank_logos/PNUMA_blank.png";
import STIBlank from "../assets/logos/blank_logos/STI_blank.png";
import UNESCOBlank from "../assets/logos/blank_logos/UNESCO_blank.png";
import UNICEFBlank from "../assets/logos/blank_logos/UNICEF_blank.png";
import UNODABlank from "../assets/logos/blank_logos/UNODA_blank.png";
import imageAgasajo1 from "../assets/images/agasajo1.webp";
import imageAgasajo2 from "../assets/images/agasajo2.webp";
import imageAgasajo3 from "../assets/images/agasajo3.webp";
import imageApertura1 from "../assets/images/apertura1.webp";
import imageApertura2 from "../assets/images/apertura2.webp";
import imageApertura3 from "../assets/images/apertura3.webp";
import imageSesiones1 from "../assets/images/sesiones1.webp";
import imageSesiones2 from "../assets/images/sesiones2.webp";
import imageSesiones3 from "../assets/images/sesiones3.webp";

export const editableOrganTopics = {
  13: "EJE 1: Nuevas agendas de seguridad; EJE 2: Hegemonía económica mundial en disputa",
  2: "Inteligencia artificial en procesos electorales. Desafíos globales de regulación, privacidad y equidad en campañas políticas",
  6: "Crisis en la región de Cachemira. Conflicto territorial y las consecuencias de su escalada",
  7: "Sostenibilidad de la deuda pública. Retos para el desarrollo, la autonomía fiscal y la estabilidad económica global",
  4: "Militarización de las fuerzas de seguridad. Del ejercicio legítimo de la violencia al abuso de poder",
  11: "Economía de la fertilidad y gestación subrogada. Dilemas éticos y jurídicos sobre la instrumentalización de la mujer",
  12: "Políticas verdes o desarrollo: ¿una falsa dicotomía? Tensión entre la responsabilidad histórica del norte y los desafíos del sur global",
  14: "Lenguas silenciadas. La herencia de la colonización, la globalización y la exclusión lingüística",
  1: "Derecho al retorno. Obstáculos políticos, sociales y jurídicos para su implementación",
  15: "Trata con fines de explotación. La infancia en peligro: desafíos transnacionales para la protección de los derechos de niñas y niños",
  9: "Regulación de la edición genética. Entre los fines terapéuticos y las ambiciones eugenésicas",
  3: "Crímenes de lesa humanidad. Debate jurídico y avance del negacionismo internacional",
  8: "La reconfiguración del trabajo en la era de las plataformas. Tensiones entre flexibilidad, regulación y derechos laborales",
  10: "Corrupción estatal. Crimen transnacional, lavado de activos y vacíos legales en la regulación internacional",
  5: "Producción, trazabilidad y uso de las armas. El rol de los Estados en la plena vigencia de los acuerdos internacionales existentes",
};

export const suggestedOrganColors = {
  STI: ["#0080D0", "#80C0E0", "#70C0E0", "#60B0E0", "#50B0E0"],
  AG: ["#F02030", "#F09090", "#F08090", "#F08080", "#F07080"],
  CS: ["#E02080", "#F080C0", "#F070B0", "#F060B0", "#E050A0"],
  ECOSOC: ["#40B040", "#90D090", "#A0D0A0", "#80C080", "#90D0A0"],
  CDH: ["#F07020", "#FFB090", "#FFB080", "#F0A070", "#F08040"],
  ONUM: ["#801090", "#B070C0", "#C080D0", "#B060C0", "#A050B0"],
  PNUMA: ["#00C0A0", "#80E0D0", "#70E0D0", "#60D0C0", "#50D0C0"],
  UNESCO: ["#903010", "#D0A080", "#C09080", "#D0A090", "#C08060"],
  ACNUR: ["#2030C0", "#6070E0", "#4050D0", "#8090F0", "#7080E0"],
  UNICEF: ["#F08070", "#F09080", "#FFB0A0", "#F0A090", "#FFA0A0"],
  OMS: ["#FFE080", "#FFB010", "#FFD070", "#FFD060", "#FFE090"],
  CAJ: ["#BDBDBD", "#9CA3AF", "#6B7280", "#D1D5DB", "#4B5563"],
  OIT: ["#800020", "#B07080", "#902040", "#801030", "#A04060"],
  ONUDD: ["#004030", "#508070", "#407060", "#609080", "#306050"],
  UNODA: ["#000000", "#374151", "#6B7280", "#9CA3AF", "#111827"],
};

export const defaultSiteContent = {
  stats: [
    { id: "participants", value: 15584, label: "TOTAL DE PARTICIPANTES" },
    { id: "schools", value: 131, label: "COLEGIOS QUE PARTICIPARON" },
    { id: "volunteers", value: 156, label: "VOLUNTARIOS ACTUALMENTE" },
    { id: "models", value: 36, label: "MODELOS REALIZADOS" },
  ],
  links: {
    joinForm: "https://docs.google.com/forms/d/e/1FAIpQLSdSs6OBExmEBdEZiWE9vbNZXVkc92WqEZcmVkZpclx1AucDFw/viewform",
    resourcesDrive: "https://drive.google.com/drive/folders/1bDQ4vE3yD-5RqmBd1Tgqf-9WFKy4WEML",
    rules: "https://drive.google.com/uc?export=download&id=1J4SGK_Hq3XaTIT6hRcjWUTRsRppTHYAi",
    countriesByOrgan: "https://drive.google.com/file/d/17CcIvdx5EwdCgbj71OpoEiCdSC9OXWcb/view?usp=drive_link",
    additionalResources: [
      {
        id: "rules",
        title: "Reglamento Modelo ONU",
        description: "Descargá el reglamento oficial con toda la normativa y protocolos.",
        buttonText: "Descargar reglamento",
        url: "https://drive.google.com/uc?export=download&id=1J4SGK_Hq3XaTIT6hRcjWUTRsRppTHYAi",
        hidden: false,
      },
      {
        id: "countries-by-organ",
        title: "Países por Órgano",
        description: "Consultá qué países representan cada delegación en cada órgano.",
        buttonText: "Ver países por órgano",
        url: "https://drive.google.com/file/d/17CcIvdx5EwdCgbj71OpoEiCdSC9OXWcb/view?usp=drive_link",
        hidden: false,
      },
    ],
  },
  photos: {
    title: "Fotos VII Edición del Modelo Público Más Grande del País",
    embedUrl: "https://drive.google.com/embeddedfolderview?id=1MBZn4nV7mB8i9KxA_Tiypgrsy9qXrkpk#grid",
    galleryUrl: "https://drive.google.com/drive/folders/1lUwofFDsJk68XDpKdA-3HrZAPSjKmOa6",
    preparatoryUrl: "https://drive.google.com/drive/folders/1-1_qQ-c_0ZBps9Sf1Fw-R_W7aDHM0hfr",
    popup: {
      enabled: true,
      title: "¡Ya están disponibles las fotos de los modelos preparatorios!",
      subtitle: "Ingresá a la galería exclusiva y reviví los mejores momentos de los modelos preparatorios 2025.",
      buttonUrl: "https://drive.google.com/drive/folders/1-1_qQ-c_0ZBps9Sf1Fw-R_W7aDHM0hfr",
    },
    carouselSections: [
      {
        id: "apertura",
        title: "Acto de Apertura",
        subtitle: "El acto de apertura marca el comienzo del evento, con discursos que inspiran a los delegados a dar lo mejor de sí mismos.",
        folderUrl: "",
        hidden: false,
        images: [
          { src: imageApertura1, alt: "Acto de Apertura 1" },
          { src: imageApertura2, alt: "Acto de Apertura 2" },
          { src: imageApertura3, alt: "Acto de Apertura 3" },
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones",
        subtitle: "Durante las sesiones, los delegados debaten temas importantes a nivel global, proponiendo soluciones innovadoras.",
        folderUrl: "",
        hidden: false,
        images: [
          { src: imageSesiones1, alt: "Sesiones 1" },
          { src: imageSesiones2, alt: "Sesiones 2" },
          { src: imageSesiones3, alt: "Sesiones 3" },
        ],
      },
      {
        id: "agasajo",
        title: "Agasajo Diplomático",
        subtitle: "El agasajo diplomático es un evento donde los representantes tienen la oportunidad de socializar y establecer conexiones valiosas.",
        folderUrl: "",
        hidden: false,
        images: [
          { src: imageAgasajo1, alt: "Agasajo Diplomático 1" },
          { src: imageAgasajo2, alt: "Agasajo Diplomático 2" },
          { src: imageAgasajo3, alt: "Agasajo Diplomático 3" },
        ],
      },
    ],
    driveFolders: [
      {
        id: "main-gallery",
        title: "Fotos VII Edición del Modelo Público Más Grande del País",
        previewUrl: "https://drive.google.com/drive/folders/1MBZn4nV7mB8i9KxA_Tiypgrsy9qXrkpk",
        folderUrl: "https://drive.google.com/drive/folders/1MBZn4nV7mB8i9KxA_Tiypgrsy9qXrkpk",
        hidden: false,
      },
      {
        id: "full-gallery",
        title: "Galería completa",
        previewUrl: "https://drive.google.com/drive/folders/1lUwofFDsJk68XDpKdA-3HrZAPSjKmOa6",
        folderUrl: "https://drive.google.com/drive/folders/1lUwofFDsJk68XDpKdA-3HrZAPSjKmOa6",
        hidden: false,
      },
      {
        id: "preparatorios-2025",
        title: "Galería preparatorios 2025",
        previewUrl: "https://drive.google.com/drive/folders/1-1_qQ-c_0ZBps9Sf1Fw-R_W7aDHM0hfr",
        folderUrl: "https://drive.google.com/drive/folders/1-1_qQ-c_0ZBps9Sf1Fw-R_W7aDHM0hfr",
        hidden: false,
      },
    ],
  },
  modelPage: {
    subtitle: "IX Modelo Intercolegial de Naciones Unidas La Plata",
    topicEdition: "VIII Edición",
    intro:
      "Conocé todos los órganos que forman parte de los Modelos de Naciones Unidas en La Plata. A lo largo de los años, nuestra Asociación ha desarrollado una amplia variedad de órganos y comités, permitiendo a los y las participantes abordar las principales temáticas de la agenda internacional desde distintas perspectivas. Explorá cada uno y descubrí su impacto.",
  },
  donations: {
    navTitle: "Donar",
    heroTitle: "¡Hacé tu aporte al Modelo ONU más grande del país!",
    heroKicker: "Donaciones • ACSERP",
    heroButtonText: "Quiero aportar",
    heroButtonUrl:
      "https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita",
    securePaymentText: "Pago seguro • DonarOnline",
    whyTitle: "¿Por qué donar?",
    whyText:
      "Tu colaboración hace posible que miles de estudiantes de escuelas públicas y privadas de toda la región vivan una experiencia educativa transformadora. Cada donación sostiene un proyecto colectivo basado en compromiso voluntario, participación juvenil y cooperación internacional.",
    allocationTitle: "¿A dónde va tu aporte?",
    allocationItems: [
      {
        id: "logistica",
        title: "Logística educativa",
        text: "organización de actividades, espacios y recursos operativos.",
        hidden: false,
      },
      {
        id: "materiales",
        title: "Materiales",
        text: "documentación pedagógica y herramientas para delegaciones.",
        hidden: false,
      },
      {
        id: "sostenimiento",
        title: "Sostenimiento anual",
        text: "continuidad del proyecto público y gratuito más grande de Argentina.",
        hidden: false,
      },
    ],
    impactKicker: "Impacto del proyecto",
    impactNumber: "+4000",
    impactNumberText: "jóvenes participantes por ciclo",
    impactTitle: "Educación pública con impacto real",
    impactText: "tu aporte fortalece una experiencia transformadora para miles de jóvenes",
    quote:
      "Donar es apostar a una experiencia que cambia trayectorias educativas y abre oportunidades reales para miles de jóvenes.",
    quoteAuthor: "Equipo ACSERP",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        id: "seguridad",
        question: "¿La donación es segura?",
        answer: "Sí. El pago se realiza a través de DonarOnline en una plataforma segura con procesamiento cifrado.",
        hidden: false,
      },
      {
        id: "unica-vez",
        question: "¿Puedo donar una sola vez?",
        answer: "Sí. Podés realizar un aporte puntual sin compromiso de continuidad.",
        hidden: false,
      },
      {
        id: "modificar",
        question: "¿Puedo modificar o detener mis aportes?",
        answer: "Sí. Podes modificar o cancelar tus aportes en cualquier momento mandando un correo a modeloonulp@gmail.com",
        hidden: false,
      },
      {
        id: "destino",
        question: "¿A qué se destina mi aporte?",
        answer:
          "Se destina a sostener nuestras actividades durante todo el año: logística, materiales pedagógicos, recursos para delegaciones y funcionamiento general del programa.",
        hidden: false,
      },
    ],
    homeCtaTitle: "¡LA ACTIVIDAD EDUCATIVA PÚBLICA Y GRATUITA MÁS GRANDE DE ARGENTINA TE NECESITA!",
    homeCtaText:
      "Con tu aporte mensual, acompañás al Modelo ONU público más grande del país en su misión de llevar educación transformadora a miles de estudiantes cada año.",
    homeCtaButtonText: "¡Quiero donar!",
    homeCtaButtonUrl:
      "https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita",
    popup: {
      enabled: true,
      title: "Ayudanos a sostener el proyecto",
      text: "Con tu aporte apoyas una experiencia educativa publica y gratuita para miles de jovenes.",
      buttonText: "Quiero aportar",
      buttonUrl: "/donar",
      dismissText: "No volver a mostrar",
    },
  },
  organs: [
    {
      id: "STI",
      bodyId: 13,
      name: "Sala de Tratados Internacionales de las Naciones Unidas",
      shortName: "Sala de Tratados Internacionales",
      description: "La Sala de Tratados Internacionales es el espacio central para la diplomacia multilateral, donde los Estados negocian acuerdos clave sobre temas como cambio climático, desarme, derechos humanos y comercio. Actúa como foro de diálogo, consenso y formalización de compromisos internacionales, promoviendo la cooperación global y un orden basado en reglas.",
      logoUrl: stiLogo,
      blankLogoUrl: STIBlank,
      color: "#29B6F6",
      suggestedColors: suggestedOrganColors.STI,
      hidden: false,
      topicText: editableOrganTopics[13],
      topicLink: "https://drive.google.com/uc?export=download&id=1ATmQXTeIvjB8JXDExem6mu0i9t52Gig5",
    },
    {
      id: "AG",
      bodyId: 2,
      name: "Asamblea General de las Naciones Unidas",
      shortName: "Asamblea General",
      description: "La Asamblea General de las Naciones Unidas (AGNU) es el principal órgano deliberativo y representativo de la ONU, donde se reúnen los 193 Estados Miembros. Cada año, la AGNU se reúne en sesiones ordinarias para proporcionar un foro para el diálogo multilateral sobre los problemas más importantes del mundo.",
      logoUrl: agLogo,
      blankLogoUrl: agBlankLogo,
      color: "#E53935",
      suggestedColors: suggestedOrganColors.AG,
      hidden: false,
      topicText: editableOrganTopics[2],
      topicLink: "https://drive.google.com/uc?export=download&id=1vC2o0KNI_VGSM9-R6fFQtuzRhsqK0Znc",
    },
    {
      id: "CS",
      bodyId: 6,
      name: "Consejo de Seguridad de las Naciones Unidas",
      shortName: "Consejo de Seguridad",
      description: "El Consejo de Seguridad de las Naciones Unidas (CSNU) es el órgano encargado de mantener la paz y la seguridad internacionales, con la autoridad para adoptar resoluciones vinculantes que obligan a los Estados Miembros a cumplir con sus decisiones.",
      logoUrl: csLogo,
      blankLogoUrl: CSBlank,
      color: "#F06292",
      suggestedColors: suggestedOrganColors.CS,
      hidden: false,
      topicText: editableOrganTopics[6],
      topicLink: "https://drive.google.com/uc?export=download&id=17DE540lieb17lbtTKp_oVeMswgKftCdi",
    },
    {
      id: "ECOSOC",
      bodyId: 7,
      name: "Consejo Económico y Social de las Naciones Unidas",
      shortName: "Consejo Económico y Social",
      description: "El Consejo Económico y Social de las Naciones Unidas (ECOSOC) es el órgano principal encargado de coordinar la labor económica y social de la ONU, facilitando el diálogo y la cooperación entre los Estados Miembros y diversos actores para abordar los desafíos globales.",
      logoUrl: ecosocLogo,
      blankLogoUrl: ECOSOCBlank,
      color: "#66BB6A",
      suggestedColors: suggestedOrganColors.ECOSOC,
      hidden: false,
      topicText: editableOrganTopics[7],
      topicLink: "https://drive.google.com/uc?export=download&id=10FtvifmdfP1RLqbLBzLnTCN4OiGSCc_g",
    },
    {
      id: "CDH",
      bodyId: 4,
      name: "Consejo de Derechos Humanos",
      shortName: "Consejo de Derechos Humanos",
      description: "El Consejo de Derechos Humanos de la ONU es el principal órgano encargado de la promoción y protección de los derechos humanos a nivel global, revisando el cumplimiento de los derechos en todos los países miembros mediante el Examen Periódico Universal (EPU).",
      logoUrl: cdhLogo,
      blankLogoUrl: CDHBlank,
      color: "#FFA726",
      suggestedColors: suggestedOrganColors.CDH,
      hidden: false,
      topicText: editableOrganTopics[4],
      topicLink: "https://drive.google.com/uc?export=download&id=14yxGKXojw35mo3r6kh0Lh6ykF6NFup1w",
    },
    {
      id: "ONUM",
      bodyId: 11,
      name: "ONU Mujeres",
      shortName: "Oficina de ONU Mujeres",
      description: "ONU Mujeres tiene como misión promover la igualdad de género y el empoderamiento de las mujeres en todo el mundo, enfocándose en erradicar la violencia de género y promover la igualdad salarial y el acceso equitativo a la educación y salud.",
      logoUrl: onumLogo,
      blankLogoUrl: ONUMBlank,
      color: "#AB47BC",
      suggestedColors: suggestedOrganColors.ONUM,
      hidden: false,
      topicText: editableOrganTopics[11],
      topicLink: "https://drive.google.com/uc?export=download&id=16wGYo_pKRQSgufhb3JaAQQSNdTFm_yPm",
    },
    {
      id: "PNUMA",
      bodyId: 12,
      name: "Programa de las Naciones Unidas para el Medio Ambiente",
      shortName: "Programa para el Medio Ambiente",
      description: "El Programa de las Naciones Unidas para el Medio Ambiente (PNUMA) es la principal agencia de la ONU encargada de coordinar las actividades ambientales globales, promoviendo la sostenibilidad ambiental y la cooperación internacional en la protección del entorno.",
      logoUrl: pnumaLogo,
      blankLogoUrl: PNUMABlank,
      color: "#26C6DA",
      suggestedColors: suggestedOrganColors.PNUMA,
      hidden: false,
      topicText: editableOrganTopics[12],
      topicLink: "https://drive.google.com/uc?export=download&id=10FBNxZ2uvGP_zY19Mw7_hEKAPIpnQEdR",
    },
    {
      id: "UNESCO",
      bodyId: 14,
      name: "Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura",
      shortName: "UNESCO",
      description: "La UNESCO es el organismo especializado de la ONU dedicado a perseguir la paz mediante la cooperación internacional en los ámbitos de la educación, la ciencia, la cultura y la información.",
      logoUrl: unescoLogo,
      blankLogoUrl: UNESCOBlank,
      color: "#8D6E63",
      suggestedColors: suggestedOrganColors.UNESCO,
      hidden: false,
      topicText: editableOrganTopics[14],
      topicLink: "https://drive.google.com/uc?export=download&id=10f4xrhEAvyKHKQlxDQ40jkTfMI3jDcfl",
    },
    {
      id: "ACNUR",
      bodyId: 1,
      name: "Alto Comisionado de las Naciones Unidas para los Refugiados",
      shortName: "Alto Comisionado de la ONU para los Refugiados",
      description: "El Alto Comisionado de las Naciones Unidas para los Refugiados (ACNUR) es el organismo de las Naciones Unidas encargado de proteger a los refugiados y desplazados por persecuciones o conflictos, y promover soluciones duraderas a su situación mediante el reasentamiento voluntario. La misión del ACNUR es garantizar que todas las personas tengan derecho a buscar asilo y encontrar un refugio seguro en otro Estado, con la opción de regresar eventualmente a su hogar, integrarse o reasentarse.",
      logoUrl: acnurLogo,
      blankLogoUrl: ACNURBlank,
      color: "#3949AB",
      suggestedColors: suggestedOrganColors.ACNUR,
      hidden: false,
      topicText: editableOrganTopics[1],
      topicLink: "https://drive.google.com/uc?export=download&id=1g_ShvE9twXzhKBBlZEdZR_ep-S8axS4x",
    },
    {
      id: "UNICEF",
      bodyId: 15,
      name: "Fondo de las Naciones Unidas para la Infancia",
      shortName: "Fondo de la ONU para la Infancia",
      description: "El Fondo de las Naciones Unidas para la Infancia (UNICEF) provee ayuda humanitaria y desarrollo a niños y madres en países en desarrollo, trabajando en áreas como la supervivencia infantil, la educación y la protección de la infancia.",
      logoUrl: unicefLogo,
      blankLogoUrl: UNICEFBlank,
      color: "#EF5350",
      suggestedColors: suggestedOrganColors.UNICEF,
      hidden: false,
      topicText: editableOrganTopics[15],
      topicLink: "https://drive.google.com/uc?export=download&id=1JsJMr5vUB_FrKTcklRZktxl0gobmm8Gz",
    },
    {
      id: "OMS",
      bodyId: 9,
      name: "Organización Mundial de la Salud",
      shortName: "Organización Mundial de la Salud",
      description: "La Organización Mundial de la Salud (OMS) es el organismo especializado de la ONU encargado de liderar la respuesta global en salud pública, promoviendo el bienestar físico y mental de todos los pueblos.",
      logoUrl: omsLogo,
      blankLogoUrl: OMSBlank,
      color: "#FFCA28",
      suggestedColors: suggestedOrganColors.OMS,
      hidden: false,
      topicText: editableOrganTopics[9],
      topicLink: "https://drive.google.com/uc?export=download&id=1_PyFxbWzCwGI3-4PogTrTiDzLCc6cxO8",
    },
    {
      id: "CAJ",
      bodyId: 3,
      name: "Comisión de Asuntos Jurídicos",
      shortName: "Comisión de Asuntos Jurídicos",
      description: "La Comisión de Asuntos Jurídicos es el principal foro para considerar cuestiones legales en las Naciones Unidas, promoviendo la justicia internacional y el respeto por los tratados y el derecho internacional.",
      logoUrl: cajLogo,
      blankLogoUrl: CAJBlank,
      color: "#BDBDBD",
      suggestedColors: suggestedOrganColors.CAJ,
      hidden: false,
      topicText: editableOrganTopics[3],
      topicLink: "https://drive.google.com/uc?export=download&id=1xxz6hcadN9BJye5Jyj4bQL3BhZEIXKtF",
    },
    {
      id: "OIT",
      bodyId: 8,
      name: "Organización Internacional del Trabajo",
      shortName: "Organización Internacional del Trabajo",
      description: "La Organización Internacional del Trabajo (OIT) es un organismo especializado de las Naciones Unidas dedicado a promover la justicia social y los derechos laborales reconocidos internacionalmente.",
      logoUrl: oitLogo,
      blankLogoUrl: OITBlank,
      color: "#C2185B",
      suggestedColors: suggestedOrganColors.OIT,
      hidden: false,
      topicText: editableOrganTopics[8],
      topicLink: "https://drive.google.com/uc?export=download&id=1wSCIOWZocmRBXCYeWxwBdFug7buIk_U0",
    },
    {
      id: "ONUDD",
      bodyId: 10,
      name: "Oficina de las Naciones Unidas contra la Droga y el Delito",
      shortName: "Oficina de la ONU contra la Droga y el Delito",
      description: "La Oficina de las Naciones Unidas contra la Droga y el Delito (ONUDD) es la agencia de la ONU que lucha contra las drogas ilícitas y la delincuencia internacional, así como el terrorismo global.",
      logoUrl: onuddLogo,
      blankLogoUrl: ONUDDBlank,
      color: "#00897B",
      suggestedColors: suggestedOrganColors.ONUDD,
      hidden: false,
      topicText: editableOrganTopics[10],
      topicLink: "https://drive.google.com/uc?export=download&id=10lGOBy1JW2EMeGUfQC-Kc291J5I4vy1P",
    },
    {
      id: "UNODA",
      bodyId: 5,
      name: "Oficina de las Naciones Unidas para el Desarme",
      shortName: "Oficina de las Naciones Unidas para el Desarme",
      description: "La Oficina de Asuntos de Desarme de la ONU (UNODA) es un organismo creado para promover el desarme, prevenir la proliferación de armas de destrucción masiva y apoyar la aplicación de tratados internacionales en la materia.",
      logoUrl: unodaLogoCompleto,
      blankLogoUrl: UNODABlank,
      color: "#000000",
      suggestedColors: suggestedOrganColors.UNODA,
      hidden: false,
      topicText: editableOrganTopics[5],
      topicLink: "https://drive.google.com/uc?export=download&id=1prl_AmzSEcWFSsMQ3h0_WxkYTu45Zpiw",
    },
  ],
  socialPosts: {
    instagram: [
      "https://www.instagram.com/p/DLlTQFePdfw/",
      "https://www.instagram.com/p/DAjykIcsv-O/",
      "https://www.instagram.com/p/DLit0e8unXV/",
    ],
    tiktok: [
      "https://www.tiktok.com/@modeloonulp/video/7515939053162859781",
      "https://www.tiktok.com/@modeloonulp/video/7216504495075757318",
      "https://www.tiktok.com/@modeloonulp/video/7420543059194105094",
    ],
    linkedin: [
      {
        embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7232821551501324290",
        postUrl: "https://www.linkedin.com/posts/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230_durante-el-mes-de-agosto-continuamos-realizamos-activity-7232821562280665088-WQTt?utm_source=share&utm_medium=member_desktop",
      },
    ],
    youtube: [
      { id: "tF21F8CxBMk", title: "Consejo de Seguridad - Modelo ONU LP" },
      { id: "jYaxIVlTqck", title: "Procedimientos Generales - Modelo ONU LP" },
      { id: "jhtznz0ktmo", title: "Capacitación STI - Modelo ONU LP" },
    ],
  },
  adminNews: [],
};
