import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentListItem()
        .title("Site Settings")
        .schemaType("siteSettings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),

      S.documentListItem()
        .title("Homepage")
        .schemaType("homepage")
        .id("homepage")
        .child(
          S.document()
            .schemaType("homepage")
            .documentId("homepage"),
        ),

      S.documentListItem()
        .title("Biography")
        .schemaType("biography")
        .id("biography")
        .child(
          S.document()
            .schemaType("biography")
            .documentId("biography"),
        ),

      S.documentListItem()
        .title("Agenda Page")
        .schemaType("agendaPage")
        .id("agendaPage")
        .child(
          S.document()
            .schemaType("agendaPage")
            .documentId("agendaPage"),
        ),

      S.documentListItem()
        .title("Media Page")
        .schemaType("mediaPage")
        .id("mediaPage")
        .child(
          S.document()
            .schemaType("mediaPage")
            .documentId("mediaPage"),
        ),

      S.divider(),

      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("mediaItem").title("Media Items"),
      S.documentTypeListItem("repertoireItem").title("Repertoire"),
    ]);