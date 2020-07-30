package vazkii.quark.base.block;

import net.minecraft.block.BlockState;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.Direction;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.shapes.ISelectionContext;
import net.minecraft.util.math.shapes.VoxelShape;
import net.minecraft.util.math.shapes.VoxelShapes;
import net.minecraft.world.IBlockReader;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.api.distmarker.OnlyIn;
import vazkii.quark.base.module.Module;

import javax.annotation.Nonnull;

/**
 * @author WireSegal
 * Created at 12:46 PM on 8/24/19.
 */
public class QuarkGlassBlock extends QuarkBlock {

    public QuarkGlassBlock(String regname, Module module, ItemGroup creativeTab, Properties properties) {
        super(regname, module, creativeTab, properties
                .notSolid()
                .func_235827_a_((state, world, pos, entityType) -> false)
                .func_235828_a_((state, world, pos) -> false)
                .func_235842_b_((state, world, pos) -> false)
                .func_235847_c_((state, world, pos) -> false));
    }

    @Override
    @OnlyIn(Dist.CLIENT)
    @SuppressWarnings("deprecation")
    public boolean isSideInvisible(@Nonnull BlockState state, BlockState adjacentBlockState, @Nonnull Direction side) {
        return adjacentBlockState.isIn(this) || super.isSideInvisible(state, adjacentBlockState, side);
    }

    @Override
    @Nonnull
    @SuppressWarnings("deprecation")
    public VoxelShape func_230322_a_(@Nonnull BlockState state, @Nonnull IBlockReader worldIn, @Nonnull BlockPos pos, @Nonnull ISelectionContext context) {
        return VoxelShapes.empty();
    }

    @Override
    @OnlyIn(Dist.CLIENT)
    public float getAmbientOcclusionLightValue(@Nonnull BlockState state, @Nonnull IBlockReader worldIn, @Nonnull BlockPos pos) {
        return 1.0F;
    }

    @Override
    public boolean propagatesSkylightDown(@Nonnull BlockState state, @Nonnull IBlockReader reader, @Nonnull BlockPos pos) {
        return true;
    }

}
