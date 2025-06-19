import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Cita } from '@/components/dashboard/facturacion/types';

interface FacturaPDFProps {
  cita: Cita;
}

const styles = StyleSheet.create({
  page: {
    padding: '40 40',
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4F46E5',
    paddingBottom: 8,
    paddingTop: 0,
  },
  logoContainer: {
    width: '40%',
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  invoiceHeader: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'medium',
  },
  table: {
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCol: {
    flex: 1,
    fontSize: 10,
    color: '#111827',
  },
  tableColRight: {
    flex: 1,
    fontSize: 10,
    color: '#111827',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 30,
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 4,
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTop: '1px solid #E2E8F0',
  },
  totalContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderLeft: '3px solid #4F46E5',
    textAlign: 'right',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function FacturaPDF({ cita }: FacturaPDFProps) {

  return (
    <Document>
      <Page 
        size="A4" 
        style={styles.page}
        wrap
      >
        <View style={styles.header}>
          <Text>FACTURA DE SERVICIO - DOGS</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Número de Factura</Text>
          <Text style={styles.value}>{cita.id_cita_pk}</Text>
        </View>

        <View style={styles.section}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Fecha de Servicios</Text>
            <Text style={styles.value}>
              {new Date(cita.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Hora</Text>
            <Text style={styles.value}>{cita.horario_disponible}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Nombre del Perro</Text>
            <Text style={styles.value}>{cita.nombre_perro}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Empleado</Text>
            <Text style={styles.value}>{cita.nombre_empleado}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Observaciones</Text>
            <Text style={styles.value}>{cita.observaciones || 'Sin observaciones'}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Método de Pago</Text>
            <Text style={styles.value}>{cita.metodo_pago || 'Sin método de pago'}</Text>
          </View>

          <View>
            <Text style={styles.label}>Fecha de Pago</Text>
            <Text style={styles.value}>
              {cita.fecha_pago 
                ? new Date(cita.fecha_pago).toLocaleDateString('es-ES')
                : 'Sin fecha de pago'}
            </Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.total}>Total: {formatCurrency(cita.costo_total || 0)}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Gracias por confiar en nuestros servicios - DOGS</Text>
        </View>
      </Page>
    </Document>
  );
}

export default FacturaPDF;
