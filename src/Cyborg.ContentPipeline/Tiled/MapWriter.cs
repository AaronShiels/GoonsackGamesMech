using System.Runtime.Serialization.Formatters.Binary;
using Microsoft.Xna.Framework.Content.Pipeline;
using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Compiler;

namespace Cyborg.ContentPipeline.Tiled
{
    [ContentTypeWriter]
    public class MapWriter : ContentTypeWriter<MapDefinition>
    {
        private static readonly BinaryFormatter _formatter = new();

        protected override void Write(ContentWriter output, MapDefinition value) => _formatter.Serialize(output.BaseStream, value);

        public override string GetRuntimeType(TargetPlatform targetPlatform) => typeof(MapDefinition).AssemblyQualifiedName;
        public override string GetRuntimeReader(TargetPlatform targetPlatform) => typeof(MapReader).AssemblyQualifiedName;
    }
}