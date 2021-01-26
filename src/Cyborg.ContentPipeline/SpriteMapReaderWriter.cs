using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Content.Pipeline;
using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Compiler;

namespace Cyborg.ContentPipeline
{
    public class SpriteMapReader : ContentTypeReader<SpriteMap>
    {
        protected override SpriteMap Read(ContentReader input, SpriteMap existingInstance) => existingInstance ?? BinarySerializer.Deserialize<SpriteMap>(input.BaseStream);
    }

    [ContentTypeWriter]
    public class SpriteMapWriter : ContentTypeWriter<SpriteMap>
    {
        protected override void Write(ContentWriter output, SpriteMap value) => BinarySerializer.Serialize(output.BaseStream, value);

        public override string GetRuntimeType(TargetPlatform targetPlatform) => typeof(SpriteMap).AssemblyQualifiedName;
        public override string GetRuntimeReader(TargetPlatform targetPlatform) => typeof(SpriteMapReader).AssemblyQualifiedName;
    }
}