let chart;

function runModel() {
  const time = document.getElementById("timeInput").value.split(",").map(Number);
  const qt = document.getElementById("qtInput").value.split(",").map(Number);
  const model = document.getElementById("modelSelect").value;

  const qe = Math.max(...qt);
  let predicted = [];

  if (model === "pfo") {
    const k1 = 0.04;

    predicted = time.map(t => {
      return qe * (1 - Math.exp(-k1 * t));
    });

    showResults("Pseudo-first-order", qe, k1, null, qt, predicted);
  }

  if (model === "pso") {
    const k2 = 0.002;

    predicted = time.map(t => {
      return (k2 * qe * qe * t) / (1 + k2 * qe * t);
    });

    showResults("Pseudo-second-order", qe, null, k2, qt, predicted);
  }

  plotChart(time, qt, predicted);
}

function showResults(modelName, qe, k1, k2, observed, predicted) {
  const r2 = calculateR2(observed, predicted);

  document.getElementById("results").innerHTML = `
    <h3>${modelName}</h3>
    <p><strong>Estimated qe:</strong> ${qe.toFixed(3)}</p>
    ${k1 ? `<p><strong>k1:</strong> ${k1}</p>` : ""}
    ${k2 ? `<p><strong>k2:</strong> ${k2}</p>` : ""}
    <p><strong>R²:</strong> ${r2.toFixed(4)}</p>
  `;
}

function calculateR2(observed, predicted) {
  const mean = observed.reduce((a, b) => a + b, 0) / observed.length;

  const ssTot = observed.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0);
  const ssRes = observed.reduce((sum, y, i) => sum + Math.pow(y - predicted[i], 2), 0);

  return 1 - ssRes / ssTot;
}

function plotChart(time, observed, predicted) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: time,
      datasets: [
        {
          label: "Observed qt",
          data: observed,
          borderWidth: 2,
          pointRadius: 5
        },
        {
          label: "Model predicted qt",
          data: predicted,
          borderWidth: 2,
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Adsorption Kinetic Model"
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time"
          }
        },
        y: {
          title: {
            display: true,
            text: "qt"
          }
        }
      }
    }
  });
}