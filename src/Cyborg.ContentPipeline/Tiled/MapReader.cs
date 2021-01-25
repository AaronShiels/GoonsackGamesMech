using System.Runtime.Serialization.Formatters.Binary;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.ContentPipeline.Tiled
{
    public class MapReader : ContentTypeReader<MapDefinition>
    {
        private static readonly BinaryFormatter _formatter = new();

        protected override MapDefinition Read(ContentReader input, MapDefinition existingInstance)
        {
            if (existingInstance != null)
                return existingInstance;

            return (MapDefinition)_formatter.Deserialize(input.BaseStream);
        }
    }
}