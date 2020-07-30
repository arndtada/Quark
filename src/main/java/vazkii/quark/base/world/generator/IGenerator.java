package vazkii.quark.base.world.generator;

import net.minecraft.util.SharedSeedRandom;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.IWorld;
import net.minecraft.world.gen.ChunkGenerator;
import net.minecraft.world.gen.GenerationStage;
import net.minecraft.world.gen.WorldGenRegion;
import net.minecraft.world.gen.feature.structure.StructureManager;

/**
 * @author WireSegal
 * Created at 9:03 PM on 10/1/19.
 */
public interface IGenerator {
    int generate(int seedIncrement, long seed, GenerationStage.Decoration stage, WorldGenRegion worldIn, ChunkGenerator generator, StructureManager structureManager, SharedSeedRandom rand, BlockPos pos);

    boolean canGenerate(IWorld world);
}
