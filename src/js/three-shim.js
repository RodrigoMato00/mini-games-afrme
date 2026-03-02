/**
 * Reexporta el THREE.js de A-Frame para que FBXLoader (y otros loaders) carguen
 * modelos en la misma instancia que usa el renderer; así se ven en pantalla.
 */
const T = typeof AFRAME !== 'undefined' && AFRAME.THREE ? AFRAME.THREE : {};

export default T;
export const AmbientLight = T.AmbientLight;
export const AnimationClip = T.AnimationClip;
export const Bone = T.Bone;
export const BufferAttribute = T.BufferAttribute;
export const BufferGeometry = T.BufferGeometry;
export const ClampToEdgeWrapping = T.ClampToEdgeWrapping;
export const Color = T.Color;
export const Curve = T.Curve;
export const DirectionalLight = T.DirectionalLight;
export const EquirectangularReflectionMapping = T.EquirectangularReflectionMapping;
export const Euler = T.Euler;
export const FileLoader = T.FileLoader;
export const Float32BufferAttribute = T.Float32BufferAttribute;
export const Group = T.Group;
export const Line = T.Line;
export const LineBasicMaterial = T.LineBasicMaterial;
export const Loader = T.Loader;
export const LoaderUtils = T.LoaderUtils;
export const MathUtils = T.MathUtils;
export const Matrix3 = T.Matrix3;
export const Matrix4 = T.Matrix4;
export const Mesh = T.Mesh;
export const MeshLambertMaterial = T.MeshLambertMaterial;
export const MeshPhongMaterial = T.MeshPhongMaterial;
export const NumberKeyframeTrack = T.NumberKeyframeTrack;
export const Object3D = T.Object3D;
export const InterleavedBuffer = T.InterleavedBuffer;
export const InterleavedBufferAttribute = T.InterleavedBufferAttribute;
export const InstancedBufferAttribute = T.InstancedBufferAttribute;
export const OrthographicCamera = T.OrthographicCamera;
export const PerspectiveCamera = T.PerspectiveCamera;
export const PointLight = T.PointLight;
export const PropertyBinding = T.PropertyBinding;
export const Quaternion = T.Quaternion;
export const QuaternionKeyframeTrack = T.QuaternionKeyframeTrack;
export const RepeatWrapping = T.RepeatWrapping;
export const Skeleton = T.Skeleton;
export const SkinnedMesh = T.SkinnedMesh;
export const SpotLight = T.SpotLight;
export const Texture = T.Texture;
export const TextureLoader = T.TextureLoader;
export const Uint16BufferAttribute = T.Uint16BufferAttribute;
export const Uint32BufferAttribute = T.Uint32BufferAttribute;
export const Vector3 = T.Vector3;
export const Vector4 = T.Vector4;
export const VectorKeyframeTrack = T.VectorKeyframeTrack;
export const SRGBColorSpace = T.SRGBColorSpace;
export const TrianglesDrawMode = T.TrianglesDrawMode;
export const TriangleStripDrawMode = T.TriangleStripDrawMode;
export const TriangleFanDrawMode = T.TriangleFanDrawMode;
