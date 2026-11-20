/** @import {NodeId} from '@wimaengine/datastructures' */
import { Graph } from '@wimaengine/datastructures'

/* eslint-disable jsdoc/check-tag-names */
/**
 * World resource that provides a browser {@linkcode AudioContext} and directed
 * graph for connecting native Web Audio nodes.
 *
 * {@linkcode AudioPlugin} makes this resource available in the app's default
 * world. Use it to create native nodes, reserve graph slots, and connect audio
 * sources to {@linkcode AudioDestinationNode} or another graph node. Retrieve the
 * installed resource with `world.getResource(AudioGraph)` rather than
 * constructing a second graph for normal playback.
 *
 * @category resource
 *
 * @example
 * ```js
 * import { AudioGraph } from '@wimaengine/audio'
 *
 * // Read the graph resource from the world's installed resources.
 * function connectGainToOutput(world) {
 *   const graph = world.getResource(AudioGraph)
 *   const gain = graph.add(graph.getContext().createGain())
 *
 *   graph.connect(gain, graph.getRoot())
 *   return gain
 * }
 * ```
 */
export class AudioGraph {

  static default() {
    return new AudioGraph()
  }

  /**
   * Web Audio context used to create and route the graph's native nodes.
   *
   * @private
   * @type {AudioContext}
   */
  context

  /**
   * Directed graph of native Web Audio nodes and their outgoing connections.
   * A node weight can be `undefined` while a source slot is reserved. The
   * public methods maintain the edge metadata and make native
   * `AudioNode.connect()` calls when the relevant slot weights exist.
   *
   * @type {Graph<AudioGraphNode,undefined>}
   */
  graph = new Graph(true)

  /**
   * Graph ID for the context's {@linkcode AudioDestinationNode}.
   *
   * @private
   * @type {NodeId}
   */
  root

  /**
   * Creates an audio graph with a fresh {@linkcode AudioContext}.
   *
   * The context's {@linkcode AudioContext#destination} is added as
   * the first graph node and becomes the value returned by {@linkcode getRoot}.
   * Additional slots are created when callers use {@linkcode add}. This
   * constructor is browser-only because it immediately creates an
   * `AudioContext`.
   *
   * A global `pointerdown` listener calls `AudioContext.resume()` to handle
   * browser autoplay restrictions. The listener remains installed until the
   * context reports `running` after an interaction.
   *
   * @param {AudioContextOptions} [options]
   */
  constructor(options) {
    const context = new AudioContext(options)
    const rootid = this.add(context.destination)

    this.context = context
    this.root = rootid
    addEventListener('pointerdown', resumeAudio)

    /**
     *
     */
    function resumeAudio() {
      const ctx = context

      ctx.resume()

      if (ctx.state === 'running') {
        removeEventListener('pointerdown', resumeAudio)
      }
    }
  }

  /**
   * Returns the graph ID of the Web Audio context destination.
   *
   * Pass this ID as the destination of {@linkcode connect} when a source should
   * play directly through the browser's audio output.
   *
   * @returns {NodeId}
   */
  getRoot() {
    return this.root
  }

  /**
   * Returns the Web Audio context owned by this graph.
   *
   * Use the context to create native nodes before registering them with
   * {@linkcode add}, or to create replacement nodes for {@linkcode update}.
   *
   * @returns {AudioContext}
   */
  getContext() {
    return this.context
  }

  /**
   * Adds a native Web Audio node or an empty placeholder slot to the graph.
   *
   * The returned numeric ID is stable for this slot while it remains in the
   * graph. Pass `undefined` to reserve a slot before the native source exists;
   * its graph edges can then be created with {@linkcode connect} and completed
   * later with {@linkcode update}.
   *
   * @param {AudioGraphNode} node - Native node to store, or `undefined` for a
   * placeholder.
   * @returns {NodeId} The new graph-node ID.
   */
  add(node) {
    return this.graph.addNode(node)
  }

  /**
   * Records an outgoing graph edge and connects the current native nodes.
   *
   * Both IDs must identify slots already returned by {@linkcode add}, or the root
   * returned by {@linkcode getRoot}. The graph edge is stored even when either
   * slot currently contains `undefined`. Native `connect()` is called only
   * when both nodes exist. If the source slot is later populated with
   * {@linkcode update}, that replacement is connected to its existing outgoing
   * neighbours; populating only a destination slot does not rewire its
   * incoming neighbours.
   *
   * @param {NodeId} from - ID of the source graph slot.
   * @param {NodeId} to - ID of the destination graph slot.
   * @returns {void}
   */
  connect(from, to) {
    const node1 = this.graph.getNodeWeight(from)
    const node2 = this.graph.getNodeWeight(to)

    this.graph.addEdge(from, to)

    if (node1 && node2) {
      node1.connect(node2)
    }
  }

  /**
   * Returns the native node currently stored at a graph ID.
   *
   * A reserved slot, an unknown ID, or a slot cleared with {@linkcode update}
   * returns `undefined`.
   *
   * @param {NodeId} id - Graph-node ID to look up.
   * @returns {AudioGraphNode} The stored native node, or `undefined`.
   */
  get(id) {
    return this.graph.getNode(id)?.weight
  }

  /**
   * Replaces the native node stored at a graph ID.
   *
   * If the ID is not present, this method does nothing. When a previous node
   * exists, an {@linkcode AudioScheduledSourceNode} is stopped and then the
   * previous node is disconnected. A replacement node is connected to each
   * existing outgoing neighbour that currently has a native node before it is
   * stored. Incoming edges are preserved but are not reconnected by this
   * method. Passing `undefined` clears the slot while preserving its graph
   * edges, so the ID can be reused later. This resource does not expose graph
   * node removal.
   *
   * @param {NodeId} id - Graph-node ID to update.
   * @param {AudioGraphNode} value - Replacement native node, or `undefined`.
   * @returns {void}
   */
  update(id, value) {
    const node = this.graph.getNode(id)

    if (!node) return

    const previousValue = node.weight

    if (previousValue) {
      if (
        previousValue instanceof OscillatorNode ||
        previousValue instanceof ConstantSourceNode ||
        previousValue instanceof AudioBufferSourceNode ||
        previousValue instanceof AudioScheduledSourceNode
      ) previousValue.stop()

      previousValue.disconnect()
    }

    if (value) {
      this.graph.forEachNeighbour(id, (neighbour) => {
        const node = this.graph.getNodeWeight(neighbour)

        if (node) value.connect(node)
      })
    }

    node.weight = value
  }

  /*
   *
  disconnect(from, to) {
    const node1 = this.graph.getNodeWeight(from)
    const node2 = this.graph.getNodeWeight(to).

    if (node1 && node2) {
      this.graph.removeEdge(from, to)
      node1.disconnect(node2)
    }.
  }.

  remove(id) {}
   */
}

/**
 * Native Web Audio node stored in an {@linkcode AudioGraph} slot. `undefined` is a
 * valid value for a reserved or currently inactive slot.
 *
 * @typedef {(AudioBufferSourceNode | undefined) | (OscillatorNode | undefined) | Exclude<AudioNode,AudioBufferSourceNode | OscillatorNode>} AudioGraphNode
 */

/* eslint-enable jsdoc/check-tag-names */
