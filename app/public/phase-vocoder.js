const FFT = (function (t) {
  function r(e) {
    if (i[e]) return i[e].exports;
    var o = (i[e] = { i: e, l: !1, exports: {} });
    return t[e].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
  }
  var i = {};
  return (
    (r.m = t),
    (r.c = i),
    (r.i = function (t) {
      return t;
    }),
    (r.d = function (t, i, e) {
      r.o(t, i) ||
        Object.defineProperty(t, i, {
          configurable: !1,
          enumerable: !0,
          get: e,
        });
    }),
    (r.n = function (t) {
      var i =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return r.d(i, "a", i), i;
    }),
    (r.o = function (t, r) {
      return Object.prototype.hasOwnProperty.call(t, r);
    }),
    (r.p = ""),
    r((r.s = 0))
  );
})([
  function (t, r, i) {
    "use strict";
    function e(t) {
      if (
        ((this.size = 0 | t),
        this.size <= 1 || 0 != (this.size & (this.size - 1)))
      )
        throw new Error("FFT size must be a power of two and bigger than 1");
      this._csize = t << 1;
      for (var r = new Array(2 * this.size), i = 0; i < r.length; i += 2) {
        var e = (Math.PI * i) / this.size;
        (r[i] = Math.cos(e)), (r[i + 1] = -Math.sin(e));
      }
      this.table = r;
      for (var o = 0, n = 1; this.size > n; n <<= 1) o++;
      (this._width = o % 2 == 0 ? o - 1 : o),
        (this._bitrev = new Array(1 << this._width));
      for (var s = 0; s < this._bitrev.length; s++) {
        this._bitrev[s] = 0;
        for (var a = 0; a < this._width; a += 2) {
          var h = this._width - a - 2;
          this._bitrev[s] |= ((s >>> a) & 3) << h;
        }
      }
      (this._out = null), (this._data = null), (this._inv = 0);
    }
    (t.exports = e),
      (e.prototype.fromComplexArray = function (t, r) {
        for (
          var i = r || new Array(t.length >>> 1), e = 0;
          e < t.length;
          e += 2
        )
          i[e >>> 1] = t[e];
        return i;
      }),
      (e.prototype.createComplexArray = function () {
        for (var t = new Array(this._csize), r = 0; r < t.length; r++) t[r] = 0;
        return t;
      }),
      (e.prototype.toComplexArray = function (t, r) {
        for (
          var i = r || this.createComplexArray(), e = 0;
          e < i.length;
          e += 2
        )
          (i[e] = t[e >>> 1]), (i[e + 1] = 0);
        return i;
      }),
      (e.prototype.completeSpectrum = function (t) {
        for (var r = this._csize, i = r >>> 1, e = 2; e < i; e += 2)
          (t[r - e] = t[e]), (t[r - e + 1] = -t[e + 1]);
      }),
      (e.prototype.transform = function (t, r) {
        if (t === r)
          throw new Error("Input and output buffers must be different");
        (this._out = t),
          (this._data = r),
          (this._inv = 0),
          this._transform4(),
          (this._out = null),
          (this._data = null);
      }),
      (e.prototype.realTransform = function (t, r) {
        if (t === r)
          throw new Error("Input and output buffers must be different");
        (this._out = t),
          (this._data = r),
          (this._inv = 0),
          this._realTransform4(),
          (this._out = null),
          (this._data = null);
      }),
      (e.prototype.inverseTransform = function (t, r) {
        if (t === r)
          throw new Error("Input and output buffers must be different");
        (this._out = t), (this._data = r), (this._inv = 1), this._transform4();
        for (var i = 0; i < t.length; i++) t[i] /= this.size;
        (this._out = null), (this._data = null);
      }),
      (e.prototype._transform4 = function () {
        var t,
          r,
          i = this._out,
          e = this._csize,
          o = this._width,
          n = 1 << o,
          s = (e / n) << 1,
          a = this._bitrev;
        if (4 === s)
          for (t = 0, r = 0; t < e; t += s, r++) {
            var h = a[r];
            this._singleTransform2(t, h, n);
          }
        else
          for (t = 0, r = 0; t < e; t += s, r++) {
            var f = a[r];
            this._singleTransform4(t, f, n);
          }
        var u = this._inv ? -1 : 1,
          _ = this.table;
        for (n >>= 2; n >= 2; n >>= 2) {
          s = (e / n) << 1;
          var l = s >>> 2;
          for (t = 0; t < e; t += s)
            for (var p = t + l, v = t, c = 0; v < p; v += 2, c += n) {
              var d = v,
                m = d + l,
                y = m + l,
                b = y + l,
                w = i[d],
                g = i[d + 1],
                z = i[m],
                T = i[m + 1],
                x = i[y],
                A = i[y + 1],
                C = i[b],
                E = i[b + 1],
                F = w,
                I = g,
                M = _[c],
                R = u * _[c + 1],
                O = z * M - T * R,
                P = z * R + T * M,
                j = _[2 * c],
                S = u * _[2 * c + 1],
                J = x * j - A * S,
                k = x * S + A * j,
                q = _[3 * c],
                B = u * _[3 * c + 1],
                D = C * q - E * B,
                G = C * B + E * q,
                H = F + J,
                K = I + k,
                L = F - J,
                N = I - k,
                Q = O + D,
                U = P + G,
                V = u * (O - D),
                W = u * (P - G),
                X = H + Q,
                Y = K + U,
                Z = H - Q,
                $ = K - U,
                tt = L + W,
                rt = N - V,
                it = L - W,
                et = N + V;
              (i[d] = X),
                (i[d + 1] = Y),
                (i[m] = tt),
                (i[m + 1] = rt),
                (i[y] = Z),
                (i[y + 1] = $),
                (i[b] = it),
                (i[b + 1] = et);
            }
        }
      }),
      (e.prototype._singleTransform2 = function (t, r, i) {
        var e = this._out,
          o = this._data,
          n = o[r],
          s = o[r + 1],
          a = o[r + i],
          h = o[r + i + 1],
          f = n + a,
          u = s + h,
          _ = n - a,
          l = s - h;
        (e[t] = f), (e[t + 1] = u), (e[t + 2] = _), (e[t + 3] = l);
      }),
      (e.prototype._singleTransform4 = function (t, r, i) {
        var e = this._out,
          o = this._data,
          n = this._inv ? -1 : 1,
          s = 2 * i,
          a = 3 * i,
          h = o[r],
          f = o[r + 1],
          u = o[r + i],
          _ = o[r + i + 1],
          l = o[r + s],
          p = o[r + s + 1],
          v = o[r + a],
          c = o[r + a + 1],
          d = h + l,
          m = f + p,
          y = h - l,
          b = f - p,
          w = u + v,
          g = _ + c,
          z = n * (u - v),
          T = n * (_ - c),
          x = d + w,
          A = m + g,
          C = y + T,
          E = b - z,
          F = d - w,
          I = m - g,
          M = y - T,
          R = b + z;
        (e[t] = x),
          (e[t + 1] = A),
          (e[t + 2] = C),
          (e[t + 3] = E),
          (e[t + 4] = F),
          (e[t + 5] = I),
          (e[t + 6] = M),
          (e[t + 7] = R);
      }),
      (e.prototype._realTransform4 = function () {
        var t,
          r,
          i = this._out,
          e = this._csize,
          o = this._width,
          n = 1 << o,
          s = (e / n) << 1,
          a = this._bitrev;
        if (4 === s)
          for (t = 0, r = 0; t < e; t += s, r++) {
            var h = a[r];
            this._singleRealTransform2(t, h >>> 1, n >>> 1);
          }
        else
          for (t = 0, r = 0; t < e; t += s, r++) {
            var f = a[r];
            this._singleRealTransform4(t, f >>> 1, n >>> 1);
          }
        var u = this._inv ? -1 : 1,
          _ = this.table;
        for (n >>= 2; n >= 2; n >>= 2) {
          s = (e / n) << 1;
          var l = s >>> 1,
            p = l >>> 1,
            v = p >>> 1;
          for (t = 0; t < e; t += s)
            for (var c = 0, d = 0; c <= v; c += 2, d += n) {
              var m = t + c,
                y = m + p,
                b = y + p,
                w = b + p,
                g = i[m],
                z = i[m + 1],
                T = i[y],
                x = i[y + 1],
                A = i[b],
                C = i[b + 1],
                E = i[w],
                F = i[w + 1],
                I = g,
                M = z,
                R = _[d],
                O = u * _[d + 1],
                P = T * R - x * O,
                j = T * O + x * R,
                S = _[2 * d],
                J = u * _[2 * d + 1],
                k = A * S - C * J,
                q = A * J + C * S,
                B = _[3 * d],
                D = u * _[3 * d + 1],
                G = E * B - F * D,
                H = E * D + F * B,
                K = I + k,
                L = M + q,
                N = I - k,
                Q = M - q,
                U = P + G,
                V = j + H,
                W = u * (P - G),
                X = u * (j - H),
                Y = K + U,
                Z = L + V,
                $ = N + X,
                tt = Q - W;
              if (
                ((i[m] = Y),
                (i[m + 1] = Z),
                (i[y] = $),
                (i[y + 1] = tt),
                0 !== c)
              ) {
                if (c !== v) {
                  var rt = N,
                    it = -Q,
                    et = K,
                    ot = -L,
                    nt = -u * X,
                    st = -u * W,
                    at = -u * V,
                    ht = -u * U,
                    ft = rt + nt,
                    ut = it + st,
                    _t = et + ht,
                    lt = ot - at,
                    pt = t + p - c,
                    vt = t + l - c;
                  (i[pt] = ft),
                    (i[pt + 1] = ut),
                    (i[vt] = _t),
                    (i[vt + 1] = lt);
                }
              } else {
                var ct = K - U,
                  dt = L - V;
                (i[b] = ct), (i[b + 1] = dt);
              }
            }
        }
      }),
      (e.prototype._singleRealTransform2 = function (t, r, i) {
        var e = this._out,
          o = this._data,
          n = o[r],
          s = o[r + i],
          a = n + s,
          h = n - s;
        (e[t] = a), (e[t + 1] = 0), (e[t + 2] = h), (e[t + 3] = 0);
      }),
      (e.prototype._singleRealTransform4 = function (t, r, i) {
        var e = this._out,
          o = this._data,
          n = this._inv ? -1 : 1,
          s = 2 * i,
          a = 3 * i,
          h = o[r],
          f = o[r + i],
          u = o[r + s],
          _ = o[r + a],
          l = h + u,
          p = h - u,
          v = f + _,
          c = n * (f - _),
          d = l + v,
          m = p,
          y = -c,
          b = l - v,
          w = p,
          g = c;
        (e[t] = d),
          (e[t + 1] = 0),
          (e[t + 2] = m),
          (e[t + 3] = y),
          (e[t + 4] = b),
          (e[t + 5] = 0),
          (e[t + 6] = w),
          (e[t + 7] = g);
      });
  },
]);

const WEBAUDIO_BLOCK_SIZE = 128;
const BUFFERED_BLOCK_SIZE = 4096;
class OverlapAddProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);

    this.nbInputs = options.numberOfInputs;
    this.nbOutputs = options.numberOfOutputs;

    this.blockSize = options.processorOptions.blockSize;
    // TODO for now, the only support hop size is the size of a web audio block
    this.hopSize = WEBAUDIO_BLOCK_SIZE;

    this.nbOverlaps = this.blockSize / this.hopSize;

    // pre-allocate input buffers (will be reallocated if needed)
    this.inputBuffers = new Array(this.nbInputs);
    this.inputBuffersHead = new Array(this.nbInputs);
    this.inputBuffersToSend = new Array(this.nbInputs);
    // default to 1 channel per input until we know more
    for (var i = 0; i < this.nbInputs; i++) {
      this.allocateInputChannels(i, 1);
    }
    // pre-allocate input buffers (will be reallocated if needed)
    this.outputBuffers = new Array(this.nbOutputs);
    this.outputBuffersToRetrieve = new Array(this.nbOutputs);
    // default to 1 channel per output until we know more
    for (var i = 0; i < this.nbOutputs; i++) {
      this.allocateOutputChannels(i, 1);
    }
  }

  /** Handles dynamic reallocation of input/output channels buffer
   (channel numbers may vary during lifecycle) **/
  reallocateChannelsIfNeeded(inputs, outputs) {
    for (var i = 0; i < this.nbInputs; i++) {
      let nbChannels = inputs[i].length;
      if (nbChannels != this.inputBuffers[i].length) {
        this.allocateInputChannels(i, nbChannels);
      }
    }

    for (var i = 0; i < this.nbOutputs; i++) {
      let nbChannels = outputs[i].length;
      if (nbChannels != this.outputBuffers[i].length) {
        this.allocateOutputChannels(i, nbChannels);
      }
    }
  }

  allocateInputChannels(inputIndex, nbChannels) {
    // allocate input buffers

    this.inputBuffers[inputIndex] = new Array(nbChannels);
    for (var i = 0; i < nbChannels; i++) {
      this.inputBuffers[inputIndex][i] = new Float32Array(
        this.blockSize + WEBAUDIO_BLOCK_SIZE,
      );
      this.inputBuffers[inputIndex][i].fill(0);
    }

    // allocate input buffers to send and head pointers to copy from
    // (cannot directly send a pointer/subarray because input may be modified)
    this.inputBuffersHead[inputIndex] = new Array(nbChannels);
    this.inputBuffersToSend[inputIndex] = new Array(nbChannels);
    for (var i = 0; i < nbChannels; i++) {
      this.inputBuffersHead[inputIndex][i] = this.inputBuffers[inputIndex][
        i
      ].subarray(0, this.blockSize);
      this.inputBuffersToSend[inputIndex][i] = new Float32Array(this.blockSize);
    }
  }

  allocateOutputChannels(outputIndex, nbChannels) {
    // allocate output buffers
    this.outputBuffers[outputIndex] = new Array(nbChannels);
    for (var i = 0; i < nbChannels; i++) {
      this.outputBuffers[outputIndex][i] = new Float32Array(this.blockSize);
      this.outputBuffers[outputIndex][i].fill(0);
    }

    // allocate output buffers to retrieve
    // (cannot send a pointer/subarray because new output has to be add to exising output)
    this.outputBuffersToRetrieve[outputIndex] = new Array(nbChannels);
    for (var i = 0; i < nbChannels; i++) {
      this.outputBuffersToRetrieve[outputIndex][i] = new Float32Array(
        this.blockSize,
      );
      this.outputBuffersToRetrieve[outputIndex][i].fill(0);
    }
  }

  /** Read next web audio block to input buffers **/
  readInputs(inputs) {
    // when playback is paused, we may stop receiving new samples
    if (inputs[0].length && inputs[0][0].length == 0) {
      for (var i = 0; i < this.nbInputs; i++) {
        for (var j = 0; j < this.inputBuffers[i].length; j++) {
          this.inputBuffers[i][j].fill(0, this.blockSize);
        }
      }
      return;
    }

    for (var i = 0; i < this.nbInputs; i++) {
      for (var j = 0; j < this.inputBuffers[i].length; j++) {
        let webAudioBlock = inputs[i][j];
        this.inputBuffers[i][j].set(webAudioBlock, this.blockSize);
      }
    }
  }

  /** Write next web audio block from output buffers **/
  writeOutputs(outputs) {
    for (var i = 0; i < this.nbInputs; i++) {
      for (var j = 0; j < this.inputBuffers[i].length; j++) {
        let webAudioBlock = this.outputBuffers[i][j].subarray(
          0,
          WEBAUDIO_BLOCK_SIZE,
        );
        outputs[i][j].set(webAudioBlock);
      }
    }
  }

  /** Shift left content of input buffers to receive new web audio block **/
  shiftInputBuffers() {
    for (var i = 0; i < this.nbInputs; i++) {
      for (var j = 0; j < this.inputBuffers[i].length; j++) {
        this.inputBuffers[i][j].copyWithin(0, WEBAUDIO_BLOCK_SIZE);
      }
    }
  }

  /** Shift left content of output buffers to receive new web audio block **/
  shiftOutputBuffers() {
    for (var i = 0; i < this.nbOutputs; i++) {
      for (var j = 0; j < this.outputBuffers[i].length; j++) {
        this.outputBuffers[i][j].copyWithin(0, WEBAUDIO_BLOCK_SIZE);
        this.outputBuffers[i][j]
          .subarray(this.blockSize - WEBAUDIO_BLOCK_SIZE)
          .fill(0);
      }
    }
  }

  /** Copy contents of input buffers to buffer actually sent to process **/
  prepareInputBuffersToSend() {
    for (var i = 0; i < this.nbInputs; i++) {
      for (var j = 0; j < this.inputBuffers[i].length; j++) {
        this.inputBuffersToSend[i][j].set(this.inputBuffersHead[i][j]);
      }
    }
  }

  /** Add contents of output buffers just processed to output buffers **/
  handleOutputBuffersToRetrieve() {
    for (var i = 0; i < this.nbOutputs; i++) {
      for (var j = 0; j < this.outputBuffers[i].length; j++) {
        for (var k = 0; k < this.blockSize; k++) {
          this.outputBuffers[i][j][k] +=
            this.outputBuffersToRetrieve[i][j][k] / this.nbOverlaps;
        }
      }
    }
  }

  process(inputs, outputs, params) {
    this.reallocateChannelsIfNeeded(inputs, outputs);

    this.readInputs(inputs);
    this.shiftInputBuffers();
    this.prepareInputBuffersToSend();
    this.processOLA(
      this.inputBuffersToSend,
      this.outputBuffersToRetrieve,
      params,
    );
    this.handleOutputBuffersToRetrieve();
    this.writeOutputs(outputs);
    this.shiftOutputBuffers();

    return true;
  }

  processOLA(inputs, outputs, params) {
    console.assert(false, "Not overriden");
  }
}
function genHannWindow(length) {
  let win = new Float32Array(length);
  for (var i = 0; i < length; i++) {
    win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / length));
  }
  return win;
}

class PhaseVocoderProcessor extends OverlapAddProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "pitchFactor",
        defaultValue: 1,
      },
    ];
  }

  constructor(options) {
    options.processorOptions = {
      blockSize: BUFFERED_BLOCK_SIZE,
    };
    super(options);

    this.fftSize = this.blockSize;
    this.timeCursor = 0;

    this.hannWindow = genHannWindow(this.blockSize);

    // prepare FFT and pre-allocate buffers
    this.fft = new FFT(this.fftSize);
    this.freqComplexBuffer = this.fft.createComplexArray();
    this.freqComplexBufferShifted = this.fft.createComplexArray();
    this.timeComplexBuffer = this.fft.createComplexArray();
    this.magnitudes = new Float32Array(this.fftSize / 2 + 1);
    this.peakIndexes = new Int32Array(this.magnitudes.length);
    this.nbPeaks = 0;
  }

  processOLA(inputs, outputs, parameters) {
    // no automation, take last value
    const pitchFactor =
      parameters.pitchFactor[parameters.pitchFactor.length - 1];
    for (var i = 0; i < this.nbInputs; i++) {
      for (var j = 0; j < inputs[i].length; j++) {
        // big assumption here: output is symetric to input
        var input = inputs[i][j];
        var output = outputs[i][j];

        this.applyHannWindow(input);

        this.fft.realTransform(this.freqComplexBuffer, input);

        this.computeMagnitudes();
        this.findPeaks();
        this.shiftPeaks(pitchFactor);

        this.fft.completeSpectrum(this.freqComplexBufferShifted);
        this.fft.inverseTransform(
          this.timeComplexBuffer,
          this.freqComplexBufferShifted,
        );
        this.fft.fromComplexArray(this.timeComplexBuffer, output);

        this.applyHannWindow(output);
      }
    }

    this.timeCursor += this.hopSize;
  }

  /** Apply Hann window in-place */
  applyHannWindow(input) {
    for (var i = 0; i < this.blockSize; i++) {
      input[i] = input[i] * this.hannWindow[i];
    }
  }

  applyHammingWindow(input) {
    for (var i = 0; i < this.blockSize; i++) {
      input[i] =
        input[i] * (0.54 - 0.46 * Math.cos((2 * Math.PI * i) / this.blockSize));
    }
  }

  /** Compute squared magnitudes for peak finding **/
  computeMagnitudes() {
    var i = 0,
      j = 0;
    while (i < this.magnitudes.length) {
      let real = this.freqComplexBuffer[j];
      let imag = this.freqComplexBuffer[j + 1];
      // no need to sqrt for peak finding
      this.magnitudes[i] = real ** 2 + imag ** 2;
      i += 1;
      j += 2;
    }
  }

  /** Find peaks in spectrum magnitudes **/
  findPeaks() {
    this.nbPeaks = 0;
    var i = 0;
    let end = this.magnitudes.length;

    while (i < end) {
      let mag = this.magnitudes[i];

      if (i >= 1 && this.magnitudes[i - 1] >= mag) {
        i++;
        continue;
      }
      if (i >= 2 && this.magnitudes[i - 2] >= mag) {
      }
      if (i + 1 < this.magnitudes.length && this.magnitudes[i + 1] >= mag) {
        i++;
        continue;
      }
      if (i + 2 < this.magnitudes.length && this.magnitudes[i + 2] >= mag) {
        i++;
        continue;
      }

      this.peakIndexes[this.nbPeaks] = i;
      this.nbPeaks++;
      i += 2;
    }
  }

  /** Shift peaks and regions of influence by pitchFactor into new specturm */
  shiftPeaks(pitchFactor) {
    // zero-fill new spectrum
    this.freqComplexBufferShifted.fill(0);

    for (var i = 0; i < this.nbPeaks; i++) {
      let peakIndex = this.peakIndexes[i];
      let peakIndexShifted = Math.round(peakIndex * pitchFactor);

      if (peakIndexShifted > this.magnitudes.length) {
        break;
      }

      // find region of influence
      var startIndex = 0;
      var endIndex = this.fftSize;
      if (i > 0) {
        let peakIndexBefore = this.peakIndexes[i - 1];
        startIndex = peakIndex - Math.floor((peakIndex - peakIndexBefore) / 2);
      }
      if (i < this.nbPeaks - 1) {
        let peakIndexAfter = this.peakIndexes[i + 1];
        endIndex = peakIndex + Math.ceil((peakIndexAfter - peakIndex) / 2);
      }

      // shift whole region of influence around peak to shifted peak
      let startOffset = startIndex - peakIndex;
      let endOffset = endIndex - peakIndex;
      for (var j = startOffset; j < endOffset; j++) {
        let binIndex = peakIndex + j;
        let binIndexShifted = peakIndexShifted + j;

        if (binIndexShifted >= this.magnitudes.length) {
          break;
        }

        // apply phase correction
        let omegaDelta =
          (2 * Math.PI * (binIndexShifted - binIndex)) / this.fftSize;
        let phaseShiftReal = Math.cos(omegaDelta * this.timeCursor);
        let phaseShiftImag = Math.sin(omegaDelta * this.timeCursor);

        let indexReal = binIndex * 2;
        let indexImag = indexReal + 1;
        let valueReal = this.freqComplexBuffer[indexReal];
        let valueImag = this.freqComplexBuffer[indexImag];

        let valueShiftedReal =
          valueReal * phaseShiftReal - valueImag * phaseShiftImag;
        let valueShiftedImag =
          valueReal * phaseShiftImag + valueImag * phaseShiftReal;

        let indexShiftedReal = binIndexShifted * 2;
        let indexShiftedImag = indexShiftedReal + 1;
        this.freqComplexBufferShifted[indexShiftedReal] += valueShiftedReal;
        this.freqComplexBufferShifted[indexShiftedImag] += valueShiftedImag;
      }
    }
  }
}

registerProcessor("phase-vocoder", PhaseVocoderProcessor);
