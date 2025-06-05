import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { Cita } from '@/components/dashboard/facturacion/types';

interface FacturaPDFProps {
  cita: Cita;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 11,
    marginLeft: 10,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default function FacturaPDF({ cita }: FacturaPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Factura de Servicio</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Número de Factura:</Text>
          <Text style={styles.value}>{cita.id_cita_pk}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fecha de Servicio:</Text>
          <Text style={styles.value}>{new Date(cita.fecha).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>{cita.horario_disponible}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nombre del Perro:</Text>
          <Text style={styles.value}>{cita.nombre_perro}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Empleado:</Text>
          <Text style={styles.value}>{cita.nombre_empleado}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Observaciones:</Text>
          <Text style={styles.value}>{cita.observaciones || 'Sin observaciones'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Método de Pago:</Text>
          <Text style={styles.value}>{cita.metodo_pago || 'Sin método de pago'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fecha de Pago:</Text>
          <Text style={styles.value}>{cita.fecha_pago ? new Date(cita.fecha_pago).toLocaleDateString() : 'Sin fecha de pago'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.total}>Total: ${cita.costo_total}</Text>
        </View>
      </Page>
    </Document>
  );
}
