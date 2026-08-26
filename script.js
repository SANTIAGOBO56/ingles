/* =========================================================
   ENGLISH HUB - JAVASCRIPT LOGIC
   Authors: Julian Mellado & Santiago Bocanegra
========================================================= */

// Accordion toggle
function toggleTopic(headerElement) {
  const topic = headerElement.closest('.eh-topic');
  if (topic) {
    topic.classList.toggle('open');
  }
}

/* =========================================================
   CALIFICAR ACTIVIDADES DE GRAMÁTICA Y QUIZ
========================================================= */
function gradeActivity(activityId) {
  const activity = document.getElementById(activityId);
  if (!activity) return;

  const questions = activity.querySelectorAll('.eh-question');
  let score = 0;
  let unanswered = 0;

  questions.forEach(function (question) {
    question.classList.remove('correct', 'incorrect', 'unanswered');

    const oldStatus = question.querySelector('.eh-answer-status');
    if (oldStatus) {
      oldStatus.remove();
    }

    const selected = question.querySelector('input[type="radio"]:checked');

    if (!selected) {
      unanswered++;
      question.classList.add('unanswered');
      const statusDiv = document.createElement('div');
      statusDiv.className = 'eh-answer-status';
      statusDiv.textContent = '⚠️ SIN RESPONDER';
      question.appendChild(statusDiv);
      return;
    }

    const statusDiv = document.createElement('div');
    statusDiv.className = 'eh-answer-status';

    if (selected.value === 'correct') {
      score++;
      question.classList.add('correct');
      statusDiv.textContent = '✓ BIEN — ¡Respuesta correcta!';
    } else {
      question.classList.add('incorrect');
      statusDiv.textContent = '✗ MAL — Revisa la respuesta correcta abajo';
    }
    question.appendChild(statusDiv);
  });

  const result = document.getElementById('result-' + activityId);
  if (!result) return;

  result.classList.add('active');

  if (unanswered > 0) {
    result.innerHTML = '⚠️ Debes responder todas las preguntas antes de calificar. Te faltan <strong>' + unanswered + '</strong> pregunta(s).';
    result.style.color = '#f87171';
    result.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    result.style.background = 'rgba(239, 68, 68, 0.1)';
    return;
  }

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  let message = '';

  if (score === total) {
    message = '🎉 ¡Excelente! ¡Puntaje perfecto!';
  } else if (score >= Math.ceil(total * 0.7)) {
    message = '👏 ¡Muy buen trabajo! Tienes un gran dominio.';
  } else if (score >= Math.ceil(total * 0.5)) {
    message = '👍 Vas por buen camino, repasa los conceptos.';
  } else {
    message = '📚 Sigue practicando y vuelve a intentarlo.';
  }

  result.innerHTML = message + '<br/>Obtuviste <strong>' + score + '/' + total + '</strong> (' + percentage + '% de aciertos).';

  if (percentage >= 70) {
    result.style.color = '#86efac';
    result.style.borderColor = 'rgba(34, 197, 94, 0.4)';
    result.style.background = 'rgba(34, 197, 94, 0.1)';
  } else if (percentage >= 50) {
    result.style.color = '#facc15';
    result.style.borderColor = 'rgba(250, 204, 21, 0.4)';
    result.style.background = 'rgba(250, 204, 21, 0.1)';
  } else {
    result.style.color = '#f87171';
    result.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    result.style.background = 'rgba(239, 68, 68, 0.1)';
  }

  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* =========================================================
   CALIFICAR LETRAS DE CANCIONES (LISTENING)
========================================================= */
function gradeSongActivity(activityId) {
  const activity = document.getElementById(activityId);
  if (!activity) return;

  const selects = activity.querySelectorAll('.eh-word-select');
  let score = 0;
  const total = selects.length;
  let unanswered = 0;

  selects.forEach(function (select) {
    select.classList.remove('correct', 'incorrect');
    if (!select.value) {
      unanswered++;
      return;
    }

    if (select.value === select.dataset.correct) {
      score++;
      select.classList.add('correct');
    } else {
      select.classList.add('incorrect');
    }
  });

  const result = document.getElementById('result-' + activityId);
  if (!result) return;
  result.classList.add('active');

  if (unanswered > 0) {
    result.innerHTML = '⚠️ Debes completar todos los espacios antes de calificar. Te faltan <strong>' + unanswered + '</strong>.';
    result.style.color = '#f87171';
    result.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    result.style.background = 'rgba(239, 68, 68, 0.1)';
    return;
  }

  const percentage = total ? Math.round((score / total) * 100) : 0;
  const message = percentage === 100 ? '🎉 ¡Excelente oído musical!' :
    percentage >= 70 ? '👏 ¡Muy buen listening!' :
    percentage >= 50 ? '👍 Vas por buen camino, repite el audio para afinar detalles.' :
    '📚 Sigue practicando tu listening con la canción.';

  result.innerHTML = message + '<br/>Aciertos: <strong>' + score + '/' + total + '</strong> (' + percentage + '%).';

  if (percentage >= 70) {
    result.style.color = '#86efac';
    result.style.borderColor = 'rgba(34, 197, 94, 0.4)';
    result.style.background = 'rgba(34, 197, 94, 0.1)';
  } else if (percentage >= 50) {
    result.style.color = '#facc15';
    result.style.borderColor = 'rgba(250, 204, 21, 0.4)';
    result.style.background = 'rgba(250, 204, 21, 0.1)';
  } else {
    result.style.color = '#f87171';
    result.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    result.style.background = 'rgba(239, 68, 68, 0.1)';
  }

  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* =========================================================
   GENERACIÓN DE WORKSHEETS EN PDF CON RESPUESTAS DEL ALUMNO
========================================================= */
function downloadActivityPDF(title, activityId) {
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    alert('No se pudo cargar la librería jsPDF. Comprueba tu conexión a internet.');
    return;
  }

  const activity = document.getElementById(activityId);
  if (!activity) {
    alert('Actividad no encontrada en la página.');
    return;
  }

  const pdf = new window.jspdf.jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  let y = 15;

  const C = {
    navy: [15, 23, 42], // Usado para el texto principal de los títulos
    blue: [14, 165, 233],
    cyan: [56, 189, 248],
    pale: [239, 248, 252],
    border: [190, 211, 223],
    text: [31, 41, 55],
    gray: [100, 116, 139],
    white: [255, 255, 255],
    yellow: [180, 130, 0],
    green: [22, 163, 74],
    red: [220, 38, 38]
  };

  function setFill(rgb) { pdf.setFillColor(rgb[0], rgb[1], rgb[2]); }
  function setDraw(rgb) { pdf.setDrawColor(rgb[0], rgb[1], rgb[2]); }
  function setText(rgb) { pdf.setTextColor(rgb[0], rgb[1], rgb[2]); }

  function addPageIfNeeded(required) {
    if (y + required > pageHeight - 17) {
      pdf.addPage();
      y = 16;
      drawMiniHeader();
    }
  }

  function drawMiniHeader() {
    setFill([241, 245, 249]); // Gris muy claro para fondo de cabecera pequeña
    pdf.rect(0, 0, pageWidth, 10, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    setText([71, 85, 105]); // Gris oscuro para el texto
    pdf.text('ENGLISH HUB • JULIAN MELLADO & SANTIAGO BOCANEGRA', margin, 6.5);
  }

  function drawMainHeader(customTitle) {
    // Fondo claro azul cielo pastel
    setFill([224, 242, 254]);
    setDraw(C.border);
    pdf.roundedRect(margin, y, contentWidth, 34, 4, 4, 'FD');

    // Caja del logo
    setFill(C.blue);
    pdf.roundedRect(margin + 5, y + 6, 24, 22, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    setText(C.white);
    pdf.text('EH', margin + 17, y + 20, { align: 'center' });

    // Título de la sección
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    setText(C.navy); // Gris pizarra / Marino oscuro
    pdf.text('ENGLISH HUB', margin + 35, y + 12);

    pdf.setFontSize(11);
    setText([3, 73, 120]); // Azul medio
    pdf.text(customTitle || title, margin + 35, y + 21);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    setText(C.gray);
    pdf.text('WORKSHEET • STUDENT REPORT • A1 / A2', margin + 35, y + 28);

    y += 40;

    setFill(C.pale);
    setDraw(C.border);
    pdf.roundedRect(margin, y, contentWidth, 17, 3, 3, 'FD');

    setText(C.text);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('NAME / ESTUDIANTE:', margin + 5, y + 7);

    pdf.setFont('helvetica', 'normal');
    pdf.line(margin + 42, y + 7.5, margin + 92, y + 7.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('DATE / FECHA:', margin + 96, y + 7);

    pdf.setFont('helvetica', 'normal');
    pdf.line(margin + 120, y + 7.5, margin + 148, y + 7.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('SCORE / NOTA:', margin + 152, y + 7);

    pdf.setFont('helvetica', 'normal');
    pdf.line(margin + 176, y + 7.5, margin + 185, y + 7.5);

    pdf.setFontSize(7);
    setText(C.gray);
    pdf.text('Created by Julian Mellado and Santiago Bocanegra', margin + 5, y + 13);

    y += 22;
  }

  function addFooter() {
    setDraw(C.border);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    setText(C.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('ENGLISH HUB • Julian Mellado & Santiago Bocanegra • Aprende • Practica • Mejora', margin, pageHeight - 7);
    pdf.text(String(pdf.internal.getNumberOfPages()), pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  const isSong = activityId.toLowerCase().includes('lyrics');

  if (isSong) {
    // ---- PROCESAR ACTIVIDAD DE CANCIÓN ----
    drawMainHeader(title);

    setText(C.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.text('Esta es tu hoja de trabajo con las respuestas registradas en la actividad de escucha.', margin, y);
    y += 10;

    const lyricsSheet = activity.querySelector('.eh-lyrics-sheet');
    if (!lyricsSheet) {
      alert('No se encontró la letra de la canción.');
      return;
    }

    const lines = lyricsSheet.querySelectorAll('.eh-lyrics-line');
    
    lines.forEach(function (line) {
      addPageIfNeeded(12);
      
      // Reconstruir texto de la línea de forma limpia sin saltos de línea internos
      let lineParts = [];
      let lineHasSelect = false;
      let selectionCorrect = true;
      let hasAnswers = false;

      // Determinar si la línea está calificada
      const isCorrectLine = line.classList.contains('correct');
      const isIncorrectLine = line.classList.contains('incorrect');

      line.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');
          if (txt.trim()) {
            lineParts.push(txt);
          }
        } else if (node.tagName === 'SPAN') {
          if (node.className !== 'eh-line-status') {
            const txt = node.textContent.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');
            if (txt.trim()) {
              lineParts.push(txt);
            }
          }
        } else if (node.tagName === 'SELECT') {
          lineHasSelect = true;
          const selectVal = node.value;
          const correctVal = node.dataset.correct;
          hasAnswers = true;

          if (selectVal) {
            lineParts.push(` [ ${selectVal.toUpperCase()} ] `);
            if (selectVal !== correctVal) {
              selectionCorrect = false;
            }
          } else {
            lineParts.push(' [ ____________ ] ');
            selectionCorrect = false;
          }
        }
      });

      // Unir partes con espaciado limpio y remover espacios extras
      let lineText = lineParts.join('').replace(/\s+/g, ' ').trim();

      // Configuración de dibujo en PDF
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      if (lineHasSelect) {
        if (isCorrectLine || (hasAnswers && selectionCorrect && !isIncorrectLine)) {
          setText(C.green);
          pdf.setFont('helvetica', 'bold');
          pdf.text('✓  ' + lineText, margin + 5, y);
        } else if (isIncorrectLine || (!selectionCorrect && hasAnswers)) {
          setText(C.red);
          pdf.setFont('helvetica', 'bold');
          
          let corrects = [];
          line.querySelectorAll('select').forEach(sel => {
            corrects.push(sel.dataset.correct.toUpperCase());
          });
          
          pdf.text('✗  ' + lineText + '  (Correcto: ' + corrects.join(', ') + ')', margin + 5, y);
        } else {
          setText(C.yellow);
          pdf.setFont('helvetica', 'bold');
          pdf.text('o  ' + lineText, margin + 5, y);
        }
      } else {
        setText(C.text);
        pdf.text('   ' + lineText, margin + 5, y);
      }

      y += 8.5; // Mayor interlineado para evitar que se encima el texto
    });

  } else {
    // ---- PROCESAR ACTIVIDAD DE GRAMÁTICA O QUIZ FINAL ----
    drawMainHeader(title);

    setText(C.gray);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.text('Reporte de respuestas de la actividad interactiva de gramática.', margin, y);
    y += 10;

    const questions = activity.querySelectorAll('.eh-question');

    questions.forEach(function (question, index) {
      const titleElem = question.querySelector('.eh-question-title');
      let questionText = titleElem ? titleElem.textContent : `Pregunta ${index + 1}`;
      questionText = questionText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      
      const options = [];
      const optionLabels = question.querySelectorAll('.eh-option');
      let selectedValue = null;

      optionLabels.forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        const text = label.textContent.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        options.push(text);

        if (input && input.checked) {
          selectedValue = input.value;
        }
      });

      const lines = pdf.splitTextToSize(questionText, contentWidth - 12);
      const h = 10 + (lines.length * 4.5) + (options.length * 7) + 4;

      addPageIfNeeded(h + 3);

      const isCorrect = question.classList.contains('correct');
      const isIncorrect = question.classList.contains('incorrect');
      const isUnanswered = question.classList.contains('unanswered');

      if (isCorrect) {
        setFill([240, 253, 250]);
        setDraw(C.green);
      } else if (isIncorrect) {
        setFill([254, 242, 242]);
        setDraw(C.red);
      } else if (isUnanswered) {
        setFill([254, 253, 232]);
        setDraw(C.yellow);
      } else {
        setFill([248, 250, 252]);
        setDraw(C.border);
      }

      pdf.roundedRect(margin, y, contentWidth, h, 2, 2, 'FD');

      setText(C.text);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.text(lines, margin + 5, y + 6);

      let oy = y + 8 + (lines.length * 4.5);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);

      optionLabels.forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        const optText = label.textContent.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        const isChecked = input && input.checked;

        if (isChecked) {
          pdf.setFont('helvetica', 'bold');
          if (isCorrect) {
            setText(C.green);
            pdf.text('[✓]  ' + optText + '  (Tu selección - Correcto)', margin + 8, oy);
          } else if (isIncorrect) {
            setText(C.red);
            pdf.text('[✗]  ' + optText + '  (Tu selección - Incorrecto)', margin + 8, oy);
          } else {
            setText(C.blue);
            pdf.text('[X]  ' + optText + '  (Tu selección)', margin + 8, oy);
          }
        } else {
          pdf.setFont('helvetica', 'normal');
          setText(C.gray);
          if (isIncorrect && input && input.value === 'correct') {
            pdf.setFont('helvetica', 'bold');
            setText(C.green);
            pdf.text('[ ]  ' + optText + '  (Respuesta correcta)', margin + 8, oy);
          } else {
            pdf.text('[ ]  ' + optText, margin + 8, oy);
          }
        }
        oy += 7;
      });

      y += h + 5;
    });
  }

  // Firmas y Autoevaluación
  addPageIfNeeded(35);
  setFill(C.pale);
  setDraw(C.border);
  pdf.roundedRect(margin, y, contentWidth, 25, 3, 3, 'FD');

  setText(C.text);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('EVALUACIÓN / SCORE STATUS', margin + 5, y + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  const resultDiv = document.getElementById('result-' + activityId);
  let scoreText = 'Sin calificar aún en la web.';
  if (resultDiv && resultDiv.classList.contains('active')) {
    // Remover caracteres raros del texto de calificación
    scoreText = resultDiv.innerText
      .replace(/[\r\n]+/g, ' ')
      .replace(/&[a-z0-9#]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  pdf.text('Resultado obtenido: ' + scoreText, margin + 5, y + 14);
  pdf.text('I reviewed my answers / Revisé mis respuestas:  ☐ SÍ     ☐ AÚN NO', margin + 5, y + 20);

  y += 30;

  for (let p = 1; p <= pdf.internal.getNumberOfPages(); p++) {
    pdf.setPage(p);
    addFooter();
  }

  const filename = title
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, '')
    .replace(/\s+/g, '_');

  pdf.save(filename + '_Worksheet_English_Hub.pdf');
}

/* =========================================================
   REINICIAR RESPUESTAS DE ACTIVIDADES DE CANCIONES
========================================================= */
function resetSongActivity(activityId) {
  const activity = document.getElementById(activityId);
  if (!activity) return;

  // Restaurar todos los select a su valor inicial
  const selects = activity.querySelectorAll('.eh-word-select');
  selects.forEach(select => {
    select.value = "";
    select.classList.remove('correct', 'incorrect');
  });

  // Limpiar estilos de las líneas de la letra
  const lines = activity.querySelectorAll('.eh-lyrics-line');
  lines.forEach(line => {
    line.classList.remove('correct', 'incorrect', 'unanswered');
    const status = line.querySelector('.eh-line-status');
    if (status) {
      status.textContent = '';
    }
  });

  // Ocultar y limpiar el div de resultados de la actividad
  const resultDiv = document.getElementById('result-' + activityId);
  if (resultDiv) {
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('active');
    resultDiv.style.display = 'none';
  }
}

/* =========================================================
   CALIFICACIÓN AUTOMÁTICA AL SELECCIONAR LA RESPUESTA
========================================================= */
function initSongListeners() {
  const songSelects = document.querySelectorAll('.eh-lyrics-line .eh-word-select');
  songSelects.forEach(select => {
    select.addEventListener('change', () => {
      // Calificar el select individual de forma 100% independiente
      select.classList.remove('correct', 'incorrect');
      if (select.value) {
        if (select.value === select.dataset.correct) {
          select.classList.add('correct');
        } else {
          select.classList.add('incorrect');
        }
      }
    });
  });
}

// Inicializar al cargar el script
initSongListeners();
