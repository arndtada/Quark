package vazkii.quark.oddities.client.render;

import java.util.Iterator;
import java.util.Random;

import com.mojang.blaze3d.matrix.MatrixStack;

import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.IRenderTypeBuffer;
import net.minecraft.client.renderer.ItemRenderer;
import net.minecraft.client.renderer.model.ItemCameraTransforms;
import net.minecraft.client.renderer.tileentity.TileEntityRenderer;
import net.minecraft.client.renderer.tileentity.TileEntityRendererDispatcher;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.util.Direction;
import net.minecraft.util.math.vector.Vector3f;
import vazkii.quark.oddities.tile.PipeTileEntity;
import vazkii.quark.oddities.tile.PipeTileEntity.PipeItem;

public class PipeTileEntityRenderer extends TileEntityRenderer<PipeTileEntity> {

	private Random random = new Random();
	
	public PipeTileEntityRenderer(TileEntityRendererDispatcher p_i226006_1_) {
		super(p_i226006_1_);
	}

	@Override
	public void render(PipeTileEntity te, float pticks, MatrixStack matrix, IRenderTypeBuffer buffer, int light, int overlay) {
		matrix.push();
		matrix.translate(0.5, 0.5, 0.5);
		ItemRenderer render = Minecraft.getInstance().getItemRenderer();
		Iterator<PipeItem> items = te.getItemIterator();

		while(items.hasNext())
			renderItem(items.next(), render, matrix, buffer, pticks, light, overlay);
		matrix.pop();
	}
	
	private void renderItem(PipeItem item, ItemRenderer render, MatrixStack matrix, IRenderTypeBuffer buffer, float partial, int light, int overlay) {
		matrix.push();

		float scale = 0.4F;
		float fract = item.getTimeFract(partial);
		float shiftFract = fract - 0.5F;
		Direction face = item.outgoingFace;
		if(fract < 0.5)
			face = item.incomingFace.getOpposite();

		float offX = (face.getXOffset() * 1F);
		float offY = (face.getYOffset() * 1F);
		float offZ = (face.getZOffset() * 1F);
		matrix.translate(offX * shiftFract, offY * shiftFract, offZ * shiftFract);

		matrix.scale(scale, scale, scale);

		float speed = 4F;
		matrix.rotate(Vector3f.YP.rotationDegrees((item.timeInWorld + partial) * speed));

        int seed = item.stack.isEmpty() ? 187 : Item.getIdFromItem(item.stack.getItem());
        random.setSeed(seed);
		
		int count = getModelCount(item.stack);
		for(int i = 0; i < count; i++) {
			matrix.push();
			if(i > 0) {
				float spread = 0.15F;
                float x = (this.random.nextFloat() * 2.0F - 1.0F) * spread;
                float y = (this.random.nextFloat() * 2.0F - 1.0F) * spread;
                float z = (this.random.nextFloat() * 2.0F - 1.0F) * spread;
                matrix.translate(x, y, z);
			}
			
			render.renderItem(item.stack, ItemCameraTransforms.TransformType.FIXED, light, overlay, matrix, buffer);
			matrix.pop();
		}
		matrix.pop();
	}

	// RenderEntityItem copy
	protected int getModelCount(ItemStack stack) {
		if(stack.getCount() > 48)
			return 5;
		
		if(stack.getCount() > 32)
			return 4;
		
		if(stack.getCount() > 16)
			return 3;
		
		if (stack.getCount() > 1)
			return 2;

		return 1;
	}
	
}
