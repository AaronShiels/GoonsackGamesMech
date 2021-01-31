using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Content.Pipeline;
using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Compiler;

namespace Cyborg.ContentPipeline
{
    public class TiledMapReader : ContentTypeReader<TiledMap>
    {
        protected override TiledMap Read(ContentReader input, TiledMap existingInstance) => existingInstance ?? BinarySerializer.Deserialize<TiledMap>(input.BaseStream);
    }

    [ContentTypeWriter]
    public class TiledMapWriter : ContentTypeWriter<TiledMap>
    {
        protected override void Write(ContentWriter output, TiledMap value) => BinarySerializer.Serialize(output.BaseStream, value);

        public override string GetRuntimeType(TargetPlatform targetPlatform) => typeof(TiledMap).AssemblyQualifiedName;
        public override string GetRuntimeReader(TargetPlatform targetPlatform) => typeof(TiledMapReader).AssemblyQualifiedName;
    }
}