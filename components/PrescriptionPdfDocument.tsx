import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export interface PrescriptionPdfData {
  clientNome: string;
  clientTelefone?: string | null;
  data: string;
  medico?: string | null;
  adicao?: string | null;
  lentes?: string | null;
  laboratorio?: string | null;
  ordemServico?: string | null;
  observacao?: string | null;
  // OD
  odEsferico?: string | null;
  odCilindrico?: string | null;
  odEixo?: string | null;
  odDnp?: string | null;
  odAltura?: string | null;
  // OE
  oeEsferico?: string | null;
  oeCilindrico?: string | null;
  oeEixo?: string | null;
  oeDnp?: string | null;
  oeAltura?: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    color: "#374151",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingBottom: 15,
  },
  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e3a8a",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  gridCol2: {
    width: "50%",
    marginBottom: 10,
  },
  gridCol3: {
    width: "33.33%",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#4b5563",
    fontSize: 9,
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#111827",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f3f4f6",
    padding: 6,
    fontWeight: "bold",
    textAlign: "center",
    color: "#374151",
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    padding: 6,
    textAlign: "center",
  },
  tableColLeft: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    padding: 6,
    textAlign: "left",
    fontWeight: "bold",
    color: "#4b5563",
  },
  obsBox: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 5,
    minHeight: 50,
  },
  obsText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#374151",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#9ca3af",
    width: 200,
    textAlign: "center",
    paddingTop: 5,
    fontSize: 8,
    color: "#6b7280",
  },
  dateStamp: {
    fontSize: 9,
    color: "#6b7280",
  },
});

interface PrescriptionPdfDocumentProps {
  data: PrescriptionPdfData;
}

export function PrescriptionPdfDocument({ data }: PrescriptionPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* CABEÇALHO DA ÓTICA */}
        <View style={styles.header}>
          <Text style={styles.storeName}>ÓTICA EVERARDO</Text>
          <Text style={styles.subtitle}>Receita Oftalmológica / Ficha Clínica</Text>
        </View>

        {/* IDENTIFICAÇÃO DO PACIENTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação do Cliente</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol2}>
              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.value}>{data.clientNome}</Text>
            </View>
            <View style={styles.gridCol2}>
              <Text style={styles.label}>Telefone</Text>
              <Text style={styles.value}>{data.clientTelefone || "Não informado"}</Text>
            </View>
            <View style={styles.gridCol2}>
              <Text style={styles.label}>Médico Prescritor</Text>
              <Text style={styles.value}>{data.medico || "Não informado"}</Text>
            </View>
            <View style={styles.gridCol2}>
              <Text style={styles.label}>Data da Consulta</Text>
              <Text style={styles.value}>{data.data}</Text>
            </View>
          </View>
        </View>

        {/* DADOS REFRATIVOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Refrativos</Text>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Olho</Text>
              <Text style={styles.tableColHeader}>Esférico (ESF)</Text>
              <Text style={styles.tableColHeader}>Cilíndrico (CIL)</Text>
              <Text style={styles.tableColHeader}>Eixo</Text>
              <Text style={styles.tableColHeader}>DNP</Text>
              <Text style={styles.tableColHeader}>Altura</Text>
            </View>
            {/* OD */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColLeft}>OD (Direito)</Text>
              <Text style={styles.tableCol}>{data.odEsferico || "-"}</Text>
              <Text style={styles.tableCol}>{data.odCilindrico || "-"}</Text>
              <Text style={styles.tableCol}>{data.odEixo ? `${data.odEixo}°` : "-"}</Text>
              <Text style={styles.tableCol}>{data.odDnp ? `${data.odDnp} mm` : "-"}</Text>
              <Text style={styles.tableCol}>{data.odAltura ? `${data.odAltura} mm` : "-"}</Text>
            </View>
            {/* OE */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColLeft}>OE (Esquerdo)</Text>
              <Text style={styles.tableCol}>{data.oeEsferico || "-"}</Text>
              <Text style={styles.tableCol}>{data.oeCilindrico || "-"}</Text>
              <Text style={styles.tableCol}>{data.oeEixo ? `${data.oeEixo}°` : "-"}</Text>
              <Text style={styles.tableCol}>{data.oeDnp ? `${data.oeDnp} mm` : "-"}</Text>
              <Text style={styles.tableCol}>{data.oeAltura ? `${data.oeAltura} mm` : "-"}</Text>
            </View>
          </View>

          {/* Adição */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Text style={{ fontWeight: "bold", color: "#4b5563", fontSize: 9 }}>Adição: </Text>
            <Text style={{ fontSize: 10, color: "#111827", fontWeight: "bold" }}>{data.adicao || "-"}</Text>
          </View>
        </View>

        {/* ESPECIFICAÇÕES DE INDICAÇÃO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicação Óptica</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol3}>
              <Text style={styles.label}>Lentes Indicadas</Text>
              <Text style={styles.value}>{data.lentes || "Não informado"}</Text>
            </View>
            <View style={styles.gridCol3}>
              <Text style={styles.label}>Laboratório</Text>
              <Text style={styles.value}>{data.laboratorio || "Não informado"}</Text>
            </View>
            <View style={styles.gridCol3}>
              <Text style={styles.label}>Ordem de Serviço (O.S.)</Text>
              <Text style={styles.value}>{data.ordemServico || "Não informado"}</Text>
            </View>
          </View>
        </View>

        {/* OBSERVAÇÕES CLÍNICAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações Clínicas</Text>
          <View style={styles.obsBox}>
            <Text style={styles.obsText}>{data.observacao || "Nenhuma observação informada."}</Text>
          </View>
        </View>

        {/* RODAPÉ E ASSINATURA */}
        <View style={styles.footer}>
          <View style={styles.signatureContainer}>
            <Text style={styles.dateStamp}>Emissão: {new Date().toLocaleDateString("pt-BR")}</Text>
            <Text style={styles.signatureLine}>Assinatura do Profissional / Responsável</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
