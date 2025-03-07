// Función para reemplazar comas por puntos en los campos de entrada
function reemplazarComas(inputElement) {
  inputElement.value = inputElement.value.replace(/,/g, ".");
}

// Función para formatear números con punto como separador de miles y coma como separador decimal
function formatearNumero(numero) {
  return numero
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    .replace(/(\d+)(\.)(\d{2})$/, "$1,$3");
}

// Función para calcular la cuota mensual del crédito en UVAs y en pesos
function calcularCuotaMensual(
  nroCuota,
  saldoCreditoUVAs,
  tasaMensual,
  plazoEnMeses,
  valorActualUVA
) {
  // Fórmula para calcular la cuota mensual en UVAs
  let cuotaMensualUVAs =
    (saldoCreditoUVAs * tasaMensual * Math.pow(1 + tasaMensual, plazoEnMeses)) /
    (Math.pow(1 + tasaMensual, plazoEnMeses) - 1);

  // Convertir la cuota mensual de UVAs a pesos
  let cuotaMensualPesos = cuotaMensualUVAs * valorActualUVA;
  let saldoCreditoPesos = saldoCreditoUVAs * valorActualUVA;

  // Retornar un objeto con los valores calculados
  return {
    nroCuota: nroCuota,
    valorActualUVA: valorActualUVA.toFixed(2),
    cuotaMensualPesos: cuotaMensualPesos.toFixed(2),
    cuotaMensualUVAs: cuotaMensualUVAs.toFixed(2),
    saldoCreditoPesos: saldoCreditoPesos.toFixed(2),
    saldoCreditoUVAs: saldoCreditoUVAs.toFixed(2),
  };
}

// Función para simular el crédito UVA
function simularCreditoUVA(
  valorInicialUVA,
  valorInicialDolarMEP,
  plazoAnios,
  tasaNominalAnual,
  relacionCuotaIngreso,
  inflacionAnualEstimada,
  montoTotalCreditoPesos
) {
  // Convertir el plazo de años a meses
  const plazoEnMeses = plazoAnios * 12;
  // Calcular la tasa mensual a partir de la tasa nominal anual
  const tasaMensual = tasaNominalAnual / 12 / 100;
  // Calcular la inflación mensual promedio
  const inflacionMensualPromedio = 1 + inflacionAnualEstimada / 12 / 100;

  // Calcular el monto total del crédito en UVAs y en USD
  const montoTotalCreditoUVAs = montoTotalCreditoPesos / valorInicialUVA;
  const montoTotalCreditoUSD = montoTotalCreditoPesos / valorInicialDolarMEP;

  let cuotas = [];
  let saldoUVAs = montoTotalCreditoUVAs;
  let saldoMeses = plazoEnMeses;
  let uvaAjustadaIPC = valorInicialUVA;

  // Calcular las cuotas mensuales para cada mes del plazo
  for (let i = 0; i < plazoEnMeses; i++) {
    let cuota = calcularCuotaMensual(
      i + 1,
      saldoUVAs,
      tasaMensual,
      saldoMeses,
      uvaAjustadaIPC
    );

    cuotas.push({ cuota });

    saldoUVAs = saldoUVAs - cuota.cuotaMensualUVAs;
    saldoMeses = saldoMeses - 1;
    uvaAjustadaIPC = uvaAjustadaIPC * inflacionMensualPromedio;
  }

  // Calcular el ingreso mínimo necesario para la primera cuota
  const ingresoMinimo =
    (cuotas[0].cuota.cuotaMensualPesos / relacionCuotaIngreso) * 100;

  // Retornar un objeto con los resultados de la simulación
  return {
    valorInicialUVA: valorInicialUVA,
    valorInicialDolarMEP: valorInicialDolarMEP,
    plazoAnios: plazoAnios,
    tasaNominalAnual: tasaNominalAnual,
    relacionCuotaIngreso: relacionCuotaIngreso,
    inflacionAnualEstimada: inflacionAnualEstimada,
    montoTotalCreditoUVAs: montoTotalCreditoUVAs,
    montoTotalCreditoUSD: montoTotalCreditoUSD.toFixed(2),
    ingresoMinimo: ingresoMinimo,
    cuotas: cuotas,
  };
}

// Función para mostrar los resultados en el DOM
function mostrarResultados(resultado) {
  const resultadosContenido = document.getElementById("resultadosContenido");
  resultadosContenido.innerHTML = `
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th>Valor Inicial UVA</th>
          <td>ARS $${formatearNumero(resultado.valorInicialUVA)}</td>
        </tr>
        <tr>
          <th>Valor Inicial Dolar MEP</th>
          <td>ARS $${formatearNumero(resultado.valorInicialDolarMEP)}</td>
        </tr>
        <tr>
          <th>Plazo en Años</th>
          <td>${formatearNumero(resultado.plazoAnios)}</td>
        </tr>
        <tr>
          <th>Tasa Nominal Anual</th>
          <td>${formatearNumero(resultado.tasaNominalAnual)}%</td>
        </tr>
        <tr>
          <th>Relación Cuota/Ingreso</th>
          <td>${formatearNumero(resultado.relacionCuotaIngreso)}%</td>
        </tr>
        <tr>
          <th>Inflación Anual Estimada</th>
          <td>${formatearNumero(resultado.inflacionAnualEstimada)}%</td>
        </tr>
        <tr>
          <th>Monto Total Crédito en UVAs</th>
          <td>UVAs ${formatearNumero(
            resultado.montoTotalCreditoUVAs.toFixed(2)
          )}</td>
        </tr>
        <tr>
          <th>Monto Total Crédito en USD</th>
          <td>USD $${formatearNumero(resultado.montoTotalCreditoUSD)}</td>
        </tr>
        <tr>
          <th>Ingreso Mínimo Necesario</th>
          <td>ARS $${formatearNumero(resultado.ingresoMinimo.toFixed(2))}</td>
        </tr>
      </tbody>
    </table>
    <h4>Cuotas Mensuales:</h4>
    <div class="resultados-grid">
      <div class="row header-row">
        <div class="col-2">Nro Cuota</div>
        <div class="col-2">Cuota Mensual (Pesos)</div>
        <div class="col-2">Cuota Mensual (UVAs)</div>
        <div class="col-2">Valor Actual UVA</div>
        <div class="col-2">Saldo Crédito (Pesos)</div>
        <div class="col-2">Saldo Crédito (UVAs)</div>
      </div>
      ${resultado.cuotas
        .map(
          (cuota) => `
        <div class="row data-row">
          <div class="col-2">${cuota.cuota.nroCuota}</div>
          <div class="col-2">ARS $${formatearNumero(
            cuota.cuota.cuotaMensualPesos
          )}</div>
          <div class="col-2">UVAs ${formatearNumero(
            cuota.cuota.cuotaMensualUVAs
          )}</div>
          <div class="col-2">ARS $${formatearNumero(
            cuota.cuota.valorActualUVA
          )}</div>
          <div class="col-2">ARS $${formatearNumero(
            cuota.cuota.saldoCreditoPesos
          )}</div>
          <div class="col-2">UVAs ${formatearNumero(
            cuota.cuota.saldoCreditoUVAs
          )}</div>
        </div>`
        )
        .join("")}
    </div>
  `;

  // Mostrar la sección de resultados
  document.getElementById("resultados").classList.remove("d-none");
}

// Función principal que se ejecuta al enviar el formulario
function mainProgram() {
  console.log("***** Simulador de créditos UVA *****");

  // Reemplazar comas por puntos en los campos de entrada
  reemplazarComas(document.getElementById("valorUVA"));
  reemplazarComas(document.getElementById("valorDolarMEP"));
  reemplazarComas(document.getElementById("plazoAnios"));
  reemplazarComas(document.getElementById("tasaNominalAnual"));
  reemplazarComas(document.getElementById("relacionCuotaIngreso"));
  reemplazarComas(document.getElementById("inflacionAnualEstimada"));
  reemplazarComas(document.getElementById("montoTotalCredito"));

  // Obtener los valores de los campos de entrada
  const valorInicialUVA = parseFloat(document.getElementById("valorUVA").value);
  const valorInicialDolarMEP = parseFloat(
    document.getElementById("valorDolarMEP").value
  );
  const plazoAnios = parseFloat(document.getElementById("plazoAnios").value);
  const tasaNominalAnual = parseFloat(
    document.getElementById("tasaNominalAnual").value
  );
  const relacionCuotaIngreso = parseFloat(
    document.getElementById("relacionCuotaIngreso").value
  );
  const inflacionAnualEstimada = parseFloat(
    document.getElementById("inflacionAnualEstimada").value
  );
  const montoTotalCreditoUVA = parseFloat(
    document.getElementById("montoTotalCredito").value
  );

  // Validar que todos los valores sean válidos y mayores a cero
  if (
    isNaN(valorInicialUVA) ||
    valorInicialUVA <= 0 ||
    isNaN(valorInicialDolarMEP) ||
    valorInicialDolarMEP <= 0 ||
    isNaN(plazoAnios) ||
    plazoAnios <= 0 ||
    isNaN(tasaNominalAnual) ||
    tasaNominalAnual <= 0 ||
    isNaN(relacionCuotaIngreso) ||
    relacionCuotaIngreso <= 0 ||
    isNaN(inflacionAnualEstimada) ||
    inflacionAnualEstimada <= 0 ||
    isNaN(montoTotalCreditoUVA) ||
    montoTotalCreditoUVA <= 0
  ) {
    alert("Por favor, ingrese valores válidos y mayores a cero.");
    return;
  }

  // Llamar a la función de simulación del crédito UVA
  const resultado = simularCreditoUVA(
    valorInicialUVA,
    valorInicialDolarMEP,
    plazoAnios,
    tasaNominalAnual,
    relacionCuotaIngreso,
    inflacionAnualEstimada,
    montoTotalCreditoUVA
  );

  // Mostrar los resultados en el DOM
  mostrarResultados(resultado);
}
