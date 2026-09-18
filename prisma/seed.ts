import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ---------- Admin ----------
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@psicologa.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "CambiarEsta123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });

  // ---------- Configuración general ----------
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Bertha Cecilia Upegui",
      logoText: "Bertha Upegui",
      heroTitle: "Pedir ayuda no es debilidad. No estás mal por sentir lo que sientes.",
      heroSubtitle:
        "Terapia online para adultos, jóvenes, niños, parejas y familias de habla hispana, en cualquier parte del mundo.",
      heroImageUrl: "/bertha.jpeg",
      heroCtaPrimaryText: "Reservar mi primera sesión",
      heroCtaSecondaryText: "Conocé cómo trabajo",
      bookingMode: "whatsapp",
      scheduleText: "Días y horarios de atención: por confirmar.",
      cancellationPolicy:
        "Se solicita avisar con al menos 1 día de anticipación para cancelar o reprogramar una sesión.",
      whatsappMessageTemplate: "Hola, quiero agendar mi primera sesión.",
      phoneVisible: false,
      footerLegalText:
        "La información compartida en sesión es confidencial. Los datos personales enviados a través de este sitio se usan únicamente para gestionar tu atención y no se comparten con terceros.",
    },
  });

  // ---------- Sobre mí ----------
  await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Psicóloga Terapeuta",
      yearsExperience: 16,
      photoUrl: "/bertha.jpeg",
      bioHtml:
        "<p>Soy psicóloga con 16 años de experiencia acompañando procesos de cambio y bienestar emocional. Elegí esta profesión porque creo profundamente en el poder de ser escuchado sin juicio, y en que cada persona tiene los recursos para atravesar lo que le toca vivir, cuando encuentra el acompañamiento adecuado.</p><p>Hoy atiendo de forma 100% online, para poder acompañar a personas de habla hispana en cualquier parte del mundo.</p><p>Además de mi consulta, soy co-fundadora de la Fundación Proyecto Bambú, un espacio de liderazgo comunitario y bienestar emocional enfocado en mujeres migrantes. Ese trabajo me ha acercado de cerca a temas como la migración, la inclusión y el acompañamiento a familias con hijos neurodivergentes, que también forman parte de lo que trabajo en consulta.</p>",
      closingQuote: "Pedir ayuda no es debilidad. No estás mal por sentir lo que sientes.",
    },
  });

  // ---------- Redes sociales ----------
  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: [
        {
          platform: "instagram",
          url: "https://www.instagram.com/psic.berthaupegui/",
          visible: true,
          order: 0,
        },
        {
          platform: "facebook",
          url: "https://www.facebook.com/bertha.cecilia.upegui",
          visible: true,
          order: 1,
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/bertha-cecilia-upegui-galofre-578116a3/",
          visible: true,
          order: 2,
        },
      ],
    });
  }

  const educationCount = await prisma.educationItem.count();
  if (educationCount === 0) {
    await prisma.educationItem.createMany({
      data: [
        {
          type: "degree",
          title: "Psicóloga",
          institution: "Universidad de la Costa (CUC)",
          period: "2007–2013",
          order: 0,
        },
        {
          type: "degree",
          title: "Especialista en Gerencia de Recursos Humanos",
          institution: "Universidad del Norte",
          period: "2016–2017",
          order: 1,
        },
      ],
    });
  }

  // ---------- A quién atiendo ----------
  const audienceCount = await prisma.audienceGroup.count();
  if (audienceCount === 0) {
    await prisma.audienceGroup.createMany({
      data: [
        { name: "Niños", description: "A partir de 8 años.", order: 0 },
        { name: "Adolescentes", description: "", order: 1 },
        { name: "Adultos", description: "", order: 2 },
        { name: "Parejas", description: "", order: 3 },
        { name: "Familias", description: "", order: 4 },
      ],
    });
  }

  // ---------- Temas y especialidades ----------
  const specialtyCount = await prisma.specialty.count();
  if (specialtyCount === 0) {
    await prisma.specialty.createMany({
      data: [
        "Ansiedad y manejo de emociones",
        "Autoestima y autoconocimiento",
        "Duelo y pérdidas afectivas",
        "Pareja, conflictos y dependencia emocional",
        "Familia y dinámicas familiares",
        "Cambios de vida y procesos de adaptación",
        "Migración y adaptación a nuevos contextos",
        "Bienestar emocional de la mujer",
        "Crisis personales y toma de decisiones",
        "Cansancio emocional / sobrecarga",
        "Soledad y conexión",
        "Fortalecimiento de recursos personales",
        "Neurodivergencia: acompañamiento a familias",
      ].map((title, order) => ({ title, order })),
    });
  }

  // ---------- Cómo trabajo ----------
  const stepCount = await prisma.processStep.count();
  if (stepCount === 0) {
    await prisma.processStep.createMany({
      data: [
        {
          order: 0,
          title: "Valoración inicial",
          description: "Conocer tu estado emocional y el motivo de consulta.",
        },
        {
          order: 1,
          title: "Evaluación",
          description: "Uso de instrumentos psicológicos si es necesario.",
        },
        {
          order: 2,
          title: "Definición de objetivos",
          description: "Objetivos del proceso, personalizados para cada caso.",
        },
        {
          order: 3,
          title: "Selección de técnicas",
          description: "Elegidas según las necesidades de cada persona.",
        },
        {
          order: 4,
          title: "Acompañamiento continuo",
          description: "Sin fórmulas iguales para todos: cada proceso es diferente.",
        },
      ],
    });
  }

  // ---------- Servicios ----------
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          name: "Valoración inicial",
          description: "Primer encuentro para conocer tu situación y definir el camino a seguir.",
          duration: "30 minutos",
          price: null,
          frequency: "",
          order: 0,
        },
        {
          name: "Sesión de atención",
          description: "Sesión de seguimiento del proceso terapéutico.",
          duration: "45 min – 1 hora",
          price: null,
          frequency: "Diaria o semanal, según necesidad",
          order: 1,
        },
        {
          name: "Taller de Inteligencia Emocional",
          description:
            "Taller grupal para aprender a identificar, comprender y gestionar tus emociones, con herramientas prácticas para el día a día. Ideal para quienes buscan bienestar emocional más allá de la terapia individual.",
          duration: "",
          price: null,
          order: 2,
        },
        {
          name: "Programa de 8 sesiones",
          description: "Pendiente nombre y descripción final del programa.",
          duration: "",
          price: null,
          order: 3,
        },
      ],
    });
  }

  // ---------- Métodos de pago (pendiente confirmar con la psicóloga) ----------
  await prisma.paymentInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      whenToPay: "Consultar",
      issuesInvoice: false,
      acceptsInsurance: false,
      notes: "Sección pendiente de completar: formas de pago, momento del cobro y precios.",
    },
  });

  // ---------- FAQ ----------
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: "¿Cuánto cuesta la atención y cuánto dura?",
          answer: "Valores y duración: consultar directamente. (Sección en actualización).",
          order: 0,
        },
        {
          question: "¿Atienden por videollamada? ¿Qué necesito?",
          answer: "Sí, toda la atención es online por videollamada. Solo necesitas conexión a internet estable y un espacio privado.",
          order: 1,
        },
        {
          question: "¿Cuál es la diferencia entre la valoración y la sesión completa?",
          answer:
            "La valoración inicial (30 min) es un primer encuentro para conocer tu situación y definir el proceso. La sesión completa (45 min a 1 hora) es el espacio de trabajo terapéutico continuo.",
          order: 2,
        },
        {
          question: "¿Puedo cancelar o cambiar un turno?",
          answer: "Sí, avisando con al menos 1 día de anticipación.",
          order: 3,
        },
        {
          question: "¿Atienden niños? ¿A partir de qué edad?",
          answer: "Sí, se atienden niños a partir de los 8 años.",
          order: 4,
        },
      ],
    });
  }

  console.log("Seed completado.");
  console.log(`Admin: ${adminEmail} / contraseña definida en ADMIN_PASSWORD`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
