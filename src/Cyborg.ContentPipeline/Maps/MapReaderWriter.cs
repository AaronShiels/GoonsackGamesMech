using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Content.Pipeline;
using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Compiler;

namespace Cyborg.ContentPipeline.Maps
{
    public class MapReader : ContentTypeReader<Map>
    {
        protected override Map Read(ContentReader input, Map existingInstance) => existingInstance ?? BinarySerializer.Deserialize<Map>(input.BaseStream);
    }

    [ContentTypeWriter]
    public class MapWriter : ContentTypeWriter<Map>
    {
        protected override void Write(ContentWriter output, Map value) => BinarySerializer.Serialize(output.BaseStream, value);

        public override string GetRuntimeType(TargetPlatform targetPlatform) => typeof(Map).AssemblyQualifiedName;
        public override string GetRuntimeReader(TargetPlatform targetPlatform) => typeof(MapReader).AssemblyQualifiedName;
    }
}