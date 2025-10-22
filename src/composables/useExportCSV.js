/**
 * Composable para exportar datos a CSV
 * Uso: const { exportToCSV, isExporting } = useExportCSV()
 */

import { ref } from 'vue'

export function useExportCSV() {
  const isExporting = ref(false)

  /**
   * Convierte un array de objetos a formato CSV
   */
  const convertToCSV = (data, columns = null) => {
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar')
    }

    // Si no se especifican columnas, usar todas las keys del primer objeto
    const headers = columns || Object.keys(data[0])

    // Crear el header del CSV
    const csvHeader = headers.join(',')

    // Crear las filas del CSV
    const csvRows = data.map(row => {
      return headers.map(header => {
        let value = row[header]

        // Manejar valores especiales
        if (value === null || value === undefined) {
          value = ''
        } else if (typeof value === 'object') {
          value = JSON.stringify(value)
        } else if (typeof value === 'string') {
          // Escapar comillas y agregar comillas si contiene comas
          value = value.replace(/"/g, '""')
          if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            value = `"${value}"`
          }
        }

        return value
      }).join(',')
    })

    return [csvHeader, ...csvRows].join('\n')
  }

  /**
   * Descarga el archivo CSV
   */
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  /**
   * Exportar datos a CSV
   * @param {Array} data - Array de objetos a exportar
   * @param {String} filename - Nombre del archivo (sin extensión)
   * @param {Array} columns - Columnas específicas a exportar (opcional)
   * @param {Object} columnLabels - Mapeo de nombres de columnas a etiquetas amigables
   */
  const exportToCSV = async (data, filename = 'export', columns = null, columnLabels = null) => {
    try {
      isExporting.value = true

      // Si se proporcionan etiquetas de columnas, reemplazar los nombres
      let processedData = data
      if (columnLabels) {
        processedData = data.map(row => {
          const newRow = {}
          Object.keys(row).forEach(key => {
            const label = columnLabels[key] || key
            newRow[label] = row[key]
          })
          return newRow
        })

        // Si hay columnas especificadas, también mapearlas
        if (columns) {
          columns = columns.map(col => columnLabels[col] || col)
        }
      }

      const csvContent = convertToCSV(processedData, columns)
      const timestamp = new Date().toISOString().split('T')[0]
      const fullFilename = `${filename}_${timestamp}.csv`

      downloadCSV(csvContent, fullFilename)

      return { success: true, filename: fullFilename }
    } catch (error) {
      console.error('Error al exportar CSV:', error)
      return { success: false, error: error.message }
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Exportar datos de mensualidades con formato específico
   */
  const exportSubscriptionsToCSV = async (subscriptions) => {
    const processedData = subscriptions.map(sub => ({
      'Cliente': sub.customer?.fullName || 'N/A',
      'Documento': sub.customer?.identificationNumber || sub.customer?.documentNumber || 'N/A',
      'Teléfono': sub.customer?.phone || 'N/A',
      'Email': sub.customer?.email || 'N/A',
      'Vehículos': sub.vehicles?.map(v => v.licensePlate).join(', ') || 'N/A',
      'Fecha Inicio': sub.startDate ? new Date(sub.startDate).toLocaleDateString('es-CO') : 'N/A',
      'Fecha Fin': sub.endDate ? new Date(sub.endDate).toLocaleDateString('es-CO') : 'N/A',
      'Monto': `$${sub.amountPaid || sub.amount || 0}`,
      'Estado': sub.isActive ? 'Activa' : 'Inactiva'
    }))

    return await exportToCSV(processedData, 'mensualidades')
  }

  /**
   * Exportar datos de operadores
   */
  const exportOperatorsToCSV = async (operators) => {
    const processedData = operators.map(op => ({
      'Nombre Completo': op.fullName || 'N/A',
      'Usuario': op.userName || op.username || 'N/A',
      'Email': op.email || 'N/A',
      'Estado': op.isActive ? 'Activo' : 'Inactivo',
      'Fecha Registro': op.createdAt ? new Date(op.createdAt).toLocaleDateString('es-CO') : 'N/A'
    }))

    return await exportToCSV(processedData, 'operadores')
  }

  /**
   * Exportar tarifas
   */
  const exportRatesToCSV = async (rates) => {
    const processedData = rates.map(rate => ({
      'Tipo': rate.rateName || 'N/A',
      'Valor por Hora': `$${rate.hourlyRate || 0}`,
      'Fecha Vigencia': rate.effectiveFrom ? new Date(rate.effectiveFrom).toLocaleDateString('es-CO') : 'N/A'
    }))

    return await exportToCSV(processedData, 'tarifas')
  }

  return {
    exportToCSV,
    exportSubscriptionsToCSV,
    exportOperatorsToCSV,
    exportRatesToCSV,
    isExporting
  }
}
